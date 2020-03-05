const express = require('express');
const router = express.Router();
const usersRouter = require('./users.router');
const notesRouter = require('./notes.router');

router.use('/users', usersRouter);
// router.use('/notes', notesRouter);

module.exports = router;
