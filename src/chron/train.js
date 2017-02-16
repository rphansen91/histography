const path = require('path');
const fs = require('fs');
const shortid = require('shortid');
const sanitize = require('../utils/sanitize');
const tests = require('../cities').slice(0,1);
const nearbyPlaces = require('../maps');
const placeDetails = require('../detail');

const matcher = /\d{4}/g;
const naiveMatch = text => (matcher).test(text) && text.length > 20;

const find = city => {
    return nearbyPlaces(city.latitude, city.longitude)
    .then(p => placeDetails(p))
    .then(p => ({
        city: city,
        createdDate: new Date().getTime(),
        place: {
            place_id: p.place_id,
            geo: p.geometry,
            name: p.name,
            urls: p.urls,
        },
        data: sanitize(p.details)
        .filter(naiveMatch)
        .map(text => ({
            text: text,
            geo: [city.longitude,city.latitude],
            dates: text.match(matcher),
            label: true ? 'historical' : 'nonhistorical'
        }))
    }))
    .then(data => {
        const json = JSON.stringify(data, null, 2);
        const name = path.resolve(__dirname, '../../training', city.city.replace(/\ /g, '_') + '_' + shortid.generate() + '.json');
        fs.writeFileSync(name, json);
        return name
    })
    .then(res => console.log('SAVED TO: ' + res))
    .catch(err => console.log(err));
}

tests.map(find);