const fetch = require('node-fetch');
const { SEARCH_API_KEY } = require('./keys')

const GEOLOCATION = 'https://www.googleapis.com/geolocation/v1/geolocate?key=' + SEARCH_API_KEY;

module.exports = () =>
    fetch(GEOLOCATION, { method: 'POST' })
    .then(res => res.json())
    .then(res => res.location);

