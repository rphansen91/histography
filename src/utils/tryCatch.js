module.exports = fn => new Promise((res, rej) => {
    try {
        const val = fn();
        res(val);
    } catch (err) {
        rej(err);
    }
})