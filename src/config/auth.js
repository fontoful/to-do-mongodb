/**
 * Function to ensure request is authenticated
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const ensureAuthenticated = (req, res, next) => {
  // if account is authenticated
  if (req.isAuthenticated()) {
    return next();
  } else {
    // if not authenticated, return error message and 401 code
    req.flash('error_msg', 'Please log in to view that resource');
    res.status(401).json({
      message: "Unauthorized",
      status: 401
    })
  }
};
/**
 * Function to ensure request is not authenticated
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const forwardAuthenticated = (req, res, next) => {
  // if not authenticated, allow next function
  if (!req.isAuthenticated()) {
    return next();
  }
};
// export functions
module.exports = {
  ensureAuthenticated,
  forwardAuthenticated
};