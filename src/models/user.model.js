const mongoose = require('mongoose')
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: isEmail,
      message: props => `${props.value} is not a valid email! (user@domain.com)`
    }
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isNaN(v),
      message: props => `${props.value} is not a valid name!`
    }
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model('User', userSchema);
