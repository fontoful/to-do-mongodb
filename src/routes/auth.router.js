const router = require("express").Router();
const { getCurrent, login, register, logout } = require('../controllers/auth.controller');
const { checkIfAllowed, updateCount } = require('../middlewares/rate-limiter');
const passport = require('passport');
// /current - get current user
router.get("/current", passport.authenticate('jwt', { session: false }), getCurrent);
// /register - register new account
router.post("/register", register);
// /login - login to account
router.post("/login", checkIfAllowed, login, updateCount);
// /logout - logout from sessions
router.post("/logout", logout);

module.exports = router;