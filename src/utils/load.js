const fs = require('fs');

module.exports = path => new Promise((res, rej) => {
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) return rej(err);
        res(JSON.parse(data));
    })
})