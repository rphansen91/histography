const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PlaceHistory = new Schema({
  title: String,
  content: String,
  category: String,
  urls: [String],
  geo: {
    type: [Number],
    index: '2dsphere'
  }
});

module.exports = mongoose.model('PlaceHistory', PlaceHistory);