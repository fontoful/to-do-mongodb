const router = require('express').Router();
const authRouter = require('./auth.router');
const notesRouter = require('./notes.router');
const listsRouter = require('./lists.router');

router.use('/auth', authRouter);
router.use('/notes', notesRouter);
router.use('/lists', listsRouter);
// export all routes
module.exports = router;
