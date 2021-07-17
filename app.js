const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tours-route');
const userRouter = require('./routes/users-route');

/* Middleware with 3rd party lib - Morgan. Used for data logging */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* Middleware to send json body through express */
app.use(express.json());

/* A typical middleware. It will always contain a third argument. The 3rd argument can be called anything. 
    The last line of a middleware should always be the 3rd argument as a function call next();
    This middleware is applicable to each and every rout in the API and will be executed everytime any API is called.
*/
app.use((req, res, next) => {
  console.log('Hello from the middle-ware');
  req.requestTime = new Date().toISOString();
  req.defaultShit = 'Default shit into api';
  next();
});

/* 
Then using the above router created we are creating a middleware to pass that 
router into a path 
*/
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
