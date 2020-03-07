const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user.model');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      // Match user
      try {
        const user = await User.findOne({
          email: email
        });
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          user.password = undefined;
          return done(null, { ...user._doc });
        } else {
          return done(null, null, { message: 'Password incorrect' });
        }
      } catch (e) {
        console.log(e);
        return done(null, null, { message: 'Error', e });
      }
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, "-password", function (err, user) {
      done(err, user._doc);
    });
  });
};