const connect = require('./db/connect');
const Url = require('url');
const { body, form } = require('./utils/parse');

const geocoding = require('./maps');
const placeDetails = require('./wiki/detail');
const wikiSearch = require('./wiki/search');
const poiSearch = require('./pois/pois');
const { addPlace, findNear, find } = require('./history');
const test = require('./test');
const { index } = require('./routes');
const results = require('./results');
const responses = require('./utils/responses');
const sendSupport = require('./email/support');

const userAuth = require('./auth/user');
const session = require('./auth/session');

const WHITELIST = ['127.0.0.1:8155','localhost:8081','histogeo.com'];

const onWhitelist = host => 
    WHITELIST.filter(h => host.indexOf(h) !== -1).length;

module.exports = (req, res) => {
    const url = Url.parse(req.url, true);
    const origin = req.headers.origin;
    const send = responses.json(res);
    const error = responses.error(res);
    const zipped = responses.zipped(res);
    const html = responses.html(res);

    if (origin && !onWhitelist(origin)) return error({
        message: 'NOT_AUTHORIZED'
    })

    switch (url.pathname) {
        case '/': return zipped(index());
        case '/place': 
            return geocoding(url.query.lat, url.query.lng)
            .then(send)
            .catch(err => error(err.message));
        case '/detail':
            return geocoding(url.query.lat, url.query.lng)
            .then(p => placeDetails(p))
            .then(send)
            .catch(err => error(err.message));
        case '/poi':
            return poiSearch(url.query.type)(url.query.lat, url.query.lng)
            .then(send)
            .catch(err => error(err.message));
        case '/search':
            return wikiSearch({ q: url.query.q })
            .then(send)
            .catch(err => error(err.message));
        case '/test':
            return test()
            .then(results)
            .then(zipped)
            .catch(err => error(err.message));
        case '/add':
            return body(req)
            .then(data => JSON.parse(data))
            .then(data => {
                if (!data.token) return { message: 'MUST_SUPPLY_TOKEN' }
                return session.findOne(data.token)
                .then(user => {
                    data.userId = user._id;
                    return data;
                })
            })
            .then(addPlace)
            .then(send)
            .catch(err => error(err.message));
        case '/near':
            return findNear(url.query)
            .then(send)
            .catch(err => error(err.message));
        case '/history':
            return find(url.query)
            .then(send)
            .catch(err => error(err.message));
        case '/support':
            return body(req)
            .then(data => JSON.parse(data))
            .then(data => sendSupport(req, data.from, data.text))
            .then(send)
            .catch(err => error(err.message));
        case '/signup':
            return body(req)
            .then(data => JSON.parse(data))
            .then(userAuth.create)
            .then(newUser => {
                return userAuth.findOne({ email: newUser.email })
                .then(user => {
                    if (user) return Promise.reject({ message: 'Email already in use' });

                    return userAuth.save(newUser);
                })
            })
            .then(user => {
                return session.create(user._id)
                .then(session => ({
                    user, token: session.token
                }))
            })
            .then(send)
            .catch(err => error(err.message));
        case '/signin':
            return body(req)
            .then(data => JSON.parse(data))
            .then(data => {
                return userAuth.create(data)
                .then(user => userAuth.findOne({ email: user.email }))
                .then(user => {
                    if (!user) return Promise.reject({ message: 'Email not found' });

                    // SIGN IN USER
                    if (user.validatePassword(data.password)) {
                        return user;
                    } else {
                        return Promise.reject({ message: 'Invalid password' });
                    }
                })
            })
            .then(user => {
                return session.create(user._id)
                .then(session => ({
                    user, token: session.token
                }))
            })
            .then(send)
            .catch(err => error(err.message));
        case '/user':
            return session.findOne(url.query.t)
            .then(send)
            .catch(err => error(err.message));
        default: return error({ message: 'NOT_FOUND' });
    }
}