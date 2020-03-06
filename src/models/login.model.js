const mongoose = require('mongoose')
const { isEmail } = require('validator')

const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: isEmail,
      message: props => `${props.value} is not a valid email! (user@domain.com)`
    }
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Login', loginSchema);
