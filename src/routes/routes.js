const router = require('express').Router();
const usersRouter = require('./users.router');
const authRouter = require('./auth.router');
// add user routes to /users
router.use('/users', usersRouter);
router.use('/auth', authRouter);

// export all routes
module.exports = router;
