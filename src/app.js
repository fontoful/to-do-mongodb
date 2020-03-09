const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const swagger = require('swagger-ui-express');
const swaggerConfig = require('./swagger.json');
require('dotenv').config();

// init mongoose Singleton
require('./config/mongoose');
// init passport
require('./config/passport')(passport);

// main router to import all routes
const mainRouter = require('./routes/routes');
// init express app
const app = express();
// add logging
app.use(logger('dev'));
// add json support
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  })
);

//swagger config
app.use('/swagger', swagger.serve, swagger.setup(swaggerConfig));

app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
// using router in /api/v1 route
app.use('/api/v1', mainRouter);

module.exports = app;
