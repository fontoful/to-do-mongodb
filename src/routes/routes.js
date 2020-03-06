const router = require('express').Router();
const usersRouter = require('./users.router');
const notesRouter = require('./notes.router');
// add user routes to /users
router.use('/users', usersRouter);
// router.use('/notes', notesRouter);

// export all routes
module.exports = router;
