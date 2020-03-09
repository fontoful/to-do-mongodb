const router = require("express").Router();
const { getCurrent, login, register, logout } = require('../controllers/auth.controller');
const {  ensureAuthenticated } = require('../config/auth');

// /current - get current user
router.get("/current", ensureAuthenticated, getCurrent);
// /register - register new account
router.post("/register", register);
// /login - login to account
router.post("/login", login);
// /logout - logout from sessions
router.post("/logout", logout);

module.exports = router;