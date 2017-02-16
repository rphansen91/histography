const sanitizeHtml = require('sanitize-html');

const sanitizeOpts = {
    allowedTags: [],
    allowedAttributes: []
}

Array.prototype.flatten = function () {
    return this.reduce((p,c) => p.concat(c), [])
}

Array.prototype.dedupe = function () {
    return Object.keys(this.reduce((p, c) => {
        p[c] = c;
        return p;
    }, {}));
}

Array.prototype.isDefined = function (key) {
    return this.filter(c => {
        if (key) return c[key];
        return !!c;
    });
}

module.exports = HTML => 
    (HTML || [])
    .isDefined()
    .map(d => sanitizeHtml(d, sanitizeOpts))
    .map(d => d.split('\n').isDefined())
    .flatten()
    .map(d => d.split('\t').isDefined())
    .flatten()
    .map(d => d.replaceAll('&quot;', '\"'))
    .map(d => d.replaceAll('&amp;', '&'))
    .map(d => d.replace(/\[\d+\]/gi, ' ')) // REPLACE DIGITS INSISE []
    .map(d => d.trim())