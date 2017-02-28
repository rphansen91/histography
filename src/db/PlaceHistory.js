const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PlaceHistory = new Schema({
  user: { type: Schema.ObjectId, require: true },
  title: { type: String, require: true },
  content: String,
  category: String,
  urls: [String],
  date: Number,
  geo: {
    type: [Number],
    index: '2dsphere',
    required: true
  }
});

module.exports = mongoose.model('PlaceHistory', PlaceHistory);