const Tokens = require('csrf');
const Session = require('../db/Session');
const user = require('./user');
const connect = require('../db/connect');

const tokens = new Tokens();

const create = userId => connect.then(() => new Promise((res, rej) => {
    tokens.secret((err,secret) => {
        if (err) return rej(err);
        const token = tokens.create(secret);
        res({ token, secret });
    })
})).then(({ token, secret }) => {
    const session = new Session();
    session.secret = secret;
    session.token = token;
    session.user = userId;
    return save(session);
})

const save = data => connect.then(() => new Promise((res, rej) => {
    data.save((err, session) => {
        if (err) return rej(err);
        res(session);
    })
}))

const findOne = (token) => connect.then(() => new Promise((res, rej) => {
    Session.findOne({ token }, (err, session) => {
        if (err) return rej(err);
        res(session);
    })
}))
.then(session => {
    if (!session) return Promise.reject({ message: "NO_SESSION_FOUND" });
    if (!tokens.verify(session.secret, session.token)) return Promise.reject({ message: "INVALID_TOKEN" });
    return session.user;
}).then(userId => user.findOne({ _id: userId }))

module.exports = {
    create,
    findOne,
    save
}