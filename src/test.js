const tests = require('./cities').slice(0,19);
const nearbyPlaces = require('./maps');
const placeDetails = require('./wiki/detail');

const runner = t => {
    return nearbyPlaces(t.latitude, t.longitude)
    .then(p => placeDetails(p))
    .then(p => ({
        passed: true,
        name: p.name,
        img: p.urls[0],
        detail: JSON.stringify(p.details, null, 2)
    }))
    .catch(err => ({
        passed: false,
        name: t.city,
        latitude: t.latitude,
        longitude: t.longitude,
        detail: err.message
    }))
}

const testRunner = () => Promise.all(tests.map(runner))

module.exports = testRunner;