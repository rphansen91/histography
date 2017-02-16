const Url = require('url');
const { body } = require('./utils/parse');

const nearbyPlaces = require('./maps');
const placeDetails = require('./wiki/detail');
const wikiSearch = require('./wiki/search');
// const { addPlace, findNear } = require('./history');
const test = require('./test');
const results = require('./results');

const sendJson = res => json => {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });
    res.end(JSON.stringify(json));
}

const sendError = res => err => {
    res.writeHead(500, { 'CONTENT_TYPE': 'application/json' });
    res.end(JSON.stringify(err));
}

module.exports = (req, res) => {
    const send = sendJson(res);
    const error = sendError(res);
    const url = Url.parse(req.url, true);
    switch (url.pathname) {
        case '/':
        case '/place': 
            return nearbyPlaces(url.query.lat, url.query.lng)
            .then(send)
            .catch(err => error(err.message));
        case '/detail':
            return nearbyPlaces(url.query.lat, url.query.lng)
            .then(p => placeDetails(p))
            .then(send)
            .catch(err => error(err.message));
        case '/search':
            return wikiSearch({ q: url.query.q })
            .then(send)
            .catch(err => error(err.message));
        case '/test':
            return test()
            .then(results(res))
            .catch(err => error(err.message));
        // case '/add':
        //     return body(req)
        //     .then(data => ({
        //         body: JSON.parse(data)
        //     }))
        //     .then(addPlace)
        //     .then(send)
        //     .catch(err => error(err.message));
        // case '/near':
        //     return findNear(url.query)
        //     .then(send)
        //     .catch(err => error(err.message));
        default: return error('NOT FOUND');
    }
}