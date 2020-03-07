const mongoose = require('mongoose')

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
  }
});

module.exports = mongoose.model('Note', noteSchema);
