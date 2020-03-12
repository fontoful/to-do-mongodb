const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require('jsonwebtoken');
const { limiterConsecutiveFailsByUsernameAndIP, limiterSlowBruteByIP } = require('../middlewares/rate-limiter');

const ERROR_MESSAGE_AUTH = 'Email or password incorrect.';
const ERROR_MESSAGE_ALREADY = "User already registered.";
const ERROR_MESSAGE_VALIDATION = 'Invalid fields.';
const ERROR_MESSAGE_SERVER = 'Unable to create user.';
const ERROR_MESSAGE_TOO_MANY = "Too many failed attempts, try again later...";

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
  // req.logout();
  // return response
  res.status(200).json({
    message: "Ok",
    status: 200
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
  const promises = [];
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (user) {
      // user is found
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // password is correct
        if (req.resUsernameAndIP !== null && req.resUsernameAndIP.consumedPoints > 0) {
          // Reset on successful authorisation
          promises.push(limiterConsecutiveFailsByUsernameAndIP.delete(req.usernameIPkey));
        }
        const userData = {
          ...user.data,
          password: undefined
        };
        const token = jwt.sign(userData, process.env.SECRET);
        res.status(200).json({
          message: "ok",
          status: 200,
          data: {
            token,
            user: userData
          }
        });

      } else {
        // password is incorrect
        promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(req.usernameIPkey));
        res.status(400).json({
          message: ERROR_MESSAGE_AUTH,
          code: 400
        });
      }
    } else {
      // user not found
      promises.push(limiterSlowBruteByIP.consume(req.ipAddr));
      res.status(400).json({
        message: ERROR_MESSAGE_AUTH,
        code: 400
      });
    }
  } catch (e) {
    console.log(e);
    // res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
    // res.status(429).send('Too Many Requests');
    res.status(400).json({
      message: ERROR_MESSAGE_AUTH,
      code: 400,
      e
    });
  } finally {
    req.countPromises = promises;
    next();
  }
};
// export functions
module.exports = {
  getCurrent,
  login,
  register,
  logout
};