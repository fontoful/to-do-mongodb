const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'Please log in to view that resource');
    res.status(401).json({
      message: "Unauthorized",
      status: 401
    })
  }
};
const forwardAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
};

module.exports = {
  ensureAuthenticated,
  forwardAuthenticated
};