const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    secret: {type: String, required: true},
    token: {type: String, required: true},
    user: {type: Schema.ObjectId, required: true}
});

module.exports = mongoose.model('Session', sessionSchema);