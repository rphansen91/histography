const sanitize = require('../utils/sanitize');

const yearMatch = /\d{4}/g; // IS A YEAR IN THE STRING?
const naiveMatch = text => yearMatch.test(text) && text.length > 20;

module.exports = html =>
    sanitize([html])
    .filter(naiveMatch)
    .length;
