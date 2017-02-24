const { build, send } = require('./send');

module.exports = (req, from, text) => send(build({
    from: from,
    to: ['histogeo91@gmail.com'],
    subject: 'Histogeo Support',
    text: 'FROM: ' + from + '\n\n' + text + '\n\n=== USER REQUEST INFO ===\n' + JSON.stringify(req.headers, null, 2)
}))