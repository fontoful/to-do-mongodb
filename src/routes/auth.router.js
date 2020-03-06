const router = require("express").Router();
const passport = require("passport");
const { getCurrent, login, register } = require('../controllers/auth.controller');

router.get("/current", passport.authenticate('jwt', { session: false }), getCurrent);

router.post("/register", register);

router.post("/login", login);

module.exports = router;