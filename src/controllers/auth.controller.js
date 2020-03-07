const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user.model");

const getCurrent = async (req, res) => {
  res.status(200).json({
    message: "Ok",
    status: 200,
    data: req.user
  });
};

const register = async (req, res) => {
  // validate the request body first
  try {
    const { email, password, name } = req.body;
    //find an existing user
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({
      message: "User already registered.",
      status: 400
    });

    const newUser = new User({
      name,
      password,
      email
    });
    newUser.password = await bcrypt.hash(newUser.password, 10);
    await newUser.save();

    const token = newUser.generateAuthToken();
    res.header("x-auth-token", token).json({
      message: 'ok',
      status: 200,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      // reply with error and 400 code
      res.status(400).json({
        message: "Invalid fields",
        status: 400,
      });
    } else {
      res.status(500).json({
        message: "Unable to create user",
        status: 500,
      });
    }
  }
};

const logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.status(200).json({
    message: "Ok",
    code: 200
  });
};

const login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).json({
        message: "email or password incorrect",
        code: 400
      });
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      return res.status(200).json({
        message: "Ok",
        code: 200,
        data: user
      });
    });
  }
  )(req, res, next);
};

module.exports = {
  getCurrent,
  login,
  register,
  logout
};