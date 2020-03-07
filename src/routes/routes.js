const router = require('express').Router();
const usersRouter = require('./users.router');
const authRouter = require('./auth.router');
const notesRouter = require('./notes.router');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

// add user routes to /users
router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/notes', notesRouter);

// export all routes
module.exports = router;
