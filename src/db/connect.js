const mongoose = require('mongoose');
const assert = require('assert');

const project = 'histography'
let url = 'mongodb://localhost:27017/' + project;

if (process.env.NODE_ENV === 'production') {
    url = 'mongodb://rphansen91:1Onemile@ds147079.mlab.com:47079/histography'
}

const connect = new Promise((res, rej) =>
    mongoose.connect(url, (err, db) => {
        if (err) return rej(err);
        res(db);
    })).then(() => console.log("SUCCESSFULLY CONNECTED TO HISTOGRAPHY DATABASE"));

module.exports = connect;