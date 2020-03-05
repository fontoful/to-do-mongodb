let mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  id: String,
  title: String,
  body: String,
});

module.exports = mongoose.model('User', userSchema);
