const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.ObjectId,
    required: true
  },
});

module.exports = mongoose.model('List', listSchema);
