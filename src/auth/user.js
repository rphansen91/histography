const User = require('../db/User');
const connect = require('../db/connect');

const create = data => {
    const newUser = new User();
    newUser.email = unescape(data.email);
    newUser.password = newUser.encryptPassword(data.password);
    if (!newUser.validEmail())
        return Promise.reject({message: 'Invalid Email Address'})
    if (!newUser.validPassword(data.password)) 
        return Promise.reject({message: 'Password must be 6 characters'})
    
    return Promise.resolve(newUser);
}

const findOne = q => connect.then(() => new Promise((res, rej) => {
    User.findOne(q, (err, user) => {
        if (err) return rej(err);
        return res(user);
    })
}));

const save = data => connect.then(() => new Promise((res, rej) => {
    data.save((err, user) => {
        if (err) return rej(err);
        res(user);
    })
}));

module.exports = {
    create,
    save,
    findOne
}