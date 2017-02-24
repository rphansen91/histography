const nodemailer = require('nodemailer');

const user = 'histogeo91@gmail.com';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'histogeo91@gmail.com',
        pass: '1Onemile'
    }
});

const build = ({ to, from, subject, text }) => ({
    from: '<' + (from || user) + '>',
    to: to.join(','),
    subject: subject || 'Histogeo No Subject',
    text: text || ''
})

const send = opts => new Promise((res, rej) =>
    transporter.sendMail(opts, (err, info) => {
        if (err) return rej(err);
        res(info);
    }));

module.exports = {
    send,
    build
}