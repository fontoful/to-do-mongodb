const router = require("express").Router();
const { getCurrent, login, register, logout } = require('../controllers/auth.controller');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

router.get("/current", ensureAuthenticated, getCurrent);

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;