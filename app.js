const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tours-route');
const userRouter = require('./routes/users-route');
const AppError = require('./utils/error-handling/app-error');
const globalErrorHandller = require('./controllers/error-controller');

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


/* Route handler for unhandled urls
  Explanation: All middlewares execute one by one starting from the one initialized first.
  If the requested route is not caught by any of the above middleware functions then it will come to the last
  middleware function and the error handling will be initiated for a path not found.
*/
app.all('*', (req, res, next) => {
/*   res.status(404).json({
    status: 'fail',
    message: `Page not found ${req.originalUrl}`
  });
*/

  /* const err = new Error(`Page not found ${req.originalUrl}`); //This will be the err.status in the below global error handling middleware
  err.status = 'fail';
  err.statusCode = 404;

  next(err); */    
  // If an argument is passed into the next() then it will automatically assume there was an error and move the execution to global error handling middleawre


  /* Or call the Error handling calls as below */
  next(new AppError(`Page not found ${req.originalUrl}`, 404));
});


/* This middleware will be executed at the end of all requests */
app.all('*', (req, res, next) => {
 console.log('You have reached the end of the middleware stack in the router class');
});


/* 
  Global middleware function for error handling 
  Note such middleware should always have 4 params with err as the first one
*/
app.use(globalErrorHandller);


module.exports = app;