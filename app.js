const express = require('express');
const logger = require('morgan');
const cors = require('cors')

const aspirantsRouter = require('./routes/route.Aspirants');
// const investorsRouter = require('./routes/route.Investors');

const app = express();
const prefix = '/api/v1/';

// view engine setup
app.use(cors())
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Route */

app.use(prefix, aspirantsRouter);
//app.use(prefix, investorsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.status(404).json({ 'message': 'not found' });
});


module.exports = app;
