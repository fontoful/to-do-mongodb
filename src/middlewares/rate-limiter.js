const { RateLimiterMongo } = require('rate-limiter-flexible');
const { connection } = require('mongoose');
/**
 * Options to configure rate limiter with mongo
 */
const maxWrongAttemptsByIPperDay = 10;
const maxConsecutiveFailsByUsernameAndIP = 5;

const limiterSlowBruteByIP = new RateLimiterMongo({
  storeClient: connection,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 0.02, // Block for 1 day, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMongo({
  storeClient: connection,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 60 * 60 * 0.03, // Block for 1 hour
});

/**
 * Function to join email from login attempt with IP address
 * @param {String} email 
 * @param {String} ip 
 */
const getUsernameIPkey = (email, ip) => `${email}_${ip}`;
/**
 * Middleware function used to limit requests to an endpoint
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const checkIfAllowed = async (req, res, next) => {
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
    res.status(429).send('Too Many Requests');
  } else {
    // if valid, next function
    req.usernameIPkey = usernameIPkey;
    req.ipAddr = ipAddr;
    req.resUsernameAndIP = resUsernameAndIP;
    next();
  }
};

const updateCount = async (req, res, next) => {
  try {
    const array = await Promise.all(req.countPromises);
    console.log(array);
  } catch (e) {
    console.log(e);
    // res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
    // res.status(429).send('Too Many Requests');
  }
}

// export function
module.exports = {
  checkIfAllowed,
  updateCount,
  limiterSlowBruteByIP,
  limiterConsecutiveFailsByUsernameAndIP
};