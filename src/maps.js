const fetch = require('node-fetch');

const filterAddressCmp = (type, cmps) => {
    return (cmps || [])
    .filter(cmp => cmp.types[0] === type)
    .reduce((p,c) => c.long_name || p, '');
}

module.exports = (latitude, longitude) =>
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true`)
    .then(res => res.json())
    .then(res => {
        if (!res.results || !res.results.length) return Promise.reject({message: 'No location found'});
        return res.results[0];
    })
    .then(res => ({
        geo: [latitude, longitude],
        address: res.formatted_address,
        name: filterAddressCmp('locality', res.address_components),
        city: filterAddressCmp('locality', res.address_components),
        state: filterAddressCmp('administrative_area_level_1', res.address_components),
        zip: filterAddressCmp('postal_code', res.address_components)
    }))

