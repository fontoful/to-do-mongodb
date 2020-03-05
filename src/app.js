const express = require('express');
const path = require('path');
const logger = require('morgan');
// init mongoose Singleton
require('./config/mongoose');
// main router to import all routes
const mainRouter = require('./routes/routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// using router in /api/v1 route
app.use('/api/v1', mainRouter);

module.exports = app;
