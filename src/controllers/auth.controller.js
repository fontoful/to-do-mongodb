const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user.model");
const ERROR_MESSAGE_AUTH = 'Email or password incorrect.';
const ERROR_MESSAGE_ALREADY = "User already registered.";
const ERROR_MESSAGE_VALIDATION = 'Invalid fields.';
const ERROR_MESSAGE_SERVER = 'Unable to create user.';

/**
 * Get current user from request if logged in
 * @param {Request} req 
 * @param {Response} res 
 */
const getCurrent = async (req, res) => {
  res.status(200).json({
    message: "Ok",
    status: 200,
    data: req.user
  });
};

/**
 * Register user 
 * - req.body must provide email, password, and name to register user
 * - email must not be registered 
 * @param {Request} req 
 * @param {Response} res 
 */
const register = async (req, res) => {
  // validate the request body first
  try {
    const { email, password, name } = req.body;
    // find an existing user
    const user = await User.findOne({ email });
    // if user already registered, return error message
    if (user) return res.status(400).json({
      message: ERROR_MESSAGE_ALREADY,
      status: 400
    });
    // if user does not exist, create a new Mongoose object
    const newUser = new User({
      name,
      password,
      email
    });
    // hash password 
    newUser.password = await bcrypt.hash(newUser.password, 10);
    // save user in MongoDB
    await newUser.save();
    // once user is saved, return data
    res.json({
      message: 'ok',
      status: 200,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (e) {
    // if mongoose error
    if (e.name === "ValidationError") {
      // reply with error and 400 code
      res.status(400).json({
        message: ERROR_MESSAGE_VALIDATION,
        status: 400,
      });
    } else {
      // if other error
      res.status(500).json({
        message: ERROR_MESSAGE_SERVER,
        status: 500,
      });
    }
  }
};

/**
 * Logout function
 * - Logout the user from Express session 
 * @param {Request} req 
 * @param {Response} res 
 */
const logout = (req, res) => {
  // logout
  req.logout();
  // flash message
  req.flash('success_msg', 'You are logged out');
  // return response
  res.status(200).json({
    message: "Ok",
    code: 200
  });
};

/**
 * Login function 
 * - req.body must contain valid email and password
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const login = async (req, res, next) => {
  // authenticate user using local strategy
  passport.authenticate('local', (err, user, info) => {
    // if error, pass to next function
    if (err) { return next(err); }
    // if user is not found, return error message and 400 code
    if (!user) {
      return res.status(400).json({
        message: ERROR_MESSAGE_AUTH,
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
// export functions
module.exports = {
  getCurrent,
  login,
  register,
  logout
};