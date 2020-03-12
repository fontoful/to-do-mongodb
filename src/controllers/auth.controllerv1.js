const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user.model");
const ERROR_MESSAGE_AUTH = 'Email or password incorrect.';
const ERROR_MESSAGE_ALREADY = "User already registered.";
const ERROR_MESSAGE_VALIDATION = 'Invalid fields.';
const ERROR_MESSAGE_SERVER = 'Unable to create user.';
const ERROR_MESSAGE_TOO_MANY = "Too many failed attempts, try again later..."
const { RateLimiterMongo } = require('rate-limiter-flexible');
const { connection } = require('mongoose');
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
    status: 200
  });
};
const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;
/**
 * Limiter for failed attemps per day
 */
const limiterSlowBruteByIP = new RateLimiterMongo({
  storeClient: connection,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 30,
  blockDuration: 120, // Block for 1 day, if 100 wrong attempts per day
});
/**
 * Limiter for consecutive failed attemps
 */
const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMongo({
  storeClient: connection,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 130, // Block for 1 hour
});

// join email with ip
const getUsernameIPkey = (email, ip) => `${email}_${ip}`;
/**
 * Login function 
 * - req.body must contain valid email and password
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const login = async (req, res, next) => {
  const ipAddr = req.ip;
  const usernameIPkey = getUsernameIPkey(req.body.email, ipAddr);

  const [resUsernameAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
    limiterSlowBruteByIP.get(ipAddr),
  ]);

  let retrySecs = 0;

  // Check if IP or Username + IP is already blocked
  if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
  } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
  }

  if (retrySecs > 0) {
    res.set('Retry-After', String(retrySecs));
    res.status(429).json({
      message: ERROR_MESSAGE_TOO_MANY,
      status: 429
    });
  } else {

    // authenticate user using local strategy
    passport.authenticate('local', async (err, user, info) => {
      // if error, pass to next function
      if (err) { return next(err); }
      // if user is not found, return error message and 400 code
      if (!user) {
        try {
          const promises = [limiterSlowBruteByIP.consume(ipAddr)];
          // Count failed attempts by Username + IP only for registered users
          promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));

          await Promise.all(promises);

          return res.status(400).json({
            message: ERROR_MESSAGE_AUTH,
            status: 400
          });
        } catch (rlRejected) {
          if (rlRejected instanceof Error) {
            throw rlRejected;
          } else {
            res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
            res.status(429).json({
              message: ERROR_MESSAGE_TOO_MANY,
              status: 429
            });
          }
        }
      } else {
        if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
          // Reset on successful authorisation
          await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
        }
        req.logIn(user, function (err) {
          if (err) { return next(err); }
          return res.status(200).json({
            message: "Ok",
            status: 200,
            data: user
          });
        });
      }
    }
    )(req, res, next);
  }
};
// export functions
module.exports = {
  getCurrent,
  login,
  register,
  logout
};