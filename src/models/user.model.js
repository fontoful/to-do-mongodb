const mongoose = require('mongoose')
const { isEmail } = require('validator')
const jwt = require('jsonwebtoken');

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
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, email: this.email, name:this.name }, process.env.SECRET);
  return token;
}

module.exports = mongoose.model('User', userSchema);
