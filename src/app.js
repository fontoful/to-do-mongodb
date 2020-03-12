const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');
const sanitize = require('sanitize');
const swagger = require('swagger-ui-express');
const swaggerConfig = require('./swagger.json');
const Ddos = require('ddos');
const ddos = new Ddos({ burst: 10, limit: 15 })

require('dotenv').config();

// init mongoose Singleton
require('./config/mongoose');
// init passport
require('./config/passport')(passport);

// main router to import all routes
const mainRouter = require('./routes/routes');
// init express app
const app = express();
// add sanitize
app.use(sanitize.middleware);
// add logging
app.use(logger('dev'));
// add json support
app.use(express.json());
// add cors
app.use(cors({
  origin: ["http://localhost:4200"],
  credentials: true
}))
// add ddos 
app.use(ddos.express);
//swagger config
app.use('/swagger', swagger.serve, swagger.setup(swaggerConfig));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
// using router in /api/v1 route
app.use('/api/v1', mainRouter);

module.exports = app;
