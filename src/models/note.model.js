const mongoose = require('mongoose')
const List = require('./list.model');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.ObjectId,
    required: true
  },
  list: {
    type: List.schema,
    required: true
  }
});

module.exports = mongoose.model('Note', noteSchema);
