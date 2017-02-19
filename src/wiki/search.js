const sanitize = require('../utils/sanitize');
const detail = require('./detail');

const yearMatch = /\d{4}/g; // IS A YEAR IN THE STRING?
const naiveMatch = text => yearMatch.test(text) && text.length > 20;
const now = () => new Date().getTime();

const addLocation = (lng, lat) => {
    if (lng && lat) return d => {
        d.geo = [lng, lat];
        return d;
    }
    return d => d;
}

const sanitizeDetails = details => 
    details
    .map(d => ({
        name: d.name,
        urls: d.urls,
        text: sanitize([d.html])
                .filter(naiveMatch)
                .map(text => ({
                    text: text,
                    dates: text.match(yearMatch).dedupe().filter(d => d < new Date().getFullYear()), // [].prototye.dedupe instantiated in sanitize.js
                    label: d.name
                }))
                .filter(d => d.dates.length)
    }))
    .filter(d => d.text && d.text.length)
    
module.exports = ({ q, lat, lng }) => {
    const begin = now();
    const location = addLocation(lat, lng);
    return detail({ name: q })
    .then(res => {
        if (!res.details) return res;
        res.details = sanitizeDetails(res.details);
        return res;
    })
    .then(res => {
        res.searchTime = now() - begin;
        return res;
    });
}