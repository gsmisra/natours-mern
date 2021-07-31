/* 
  Global middleware function for error handling 
  Note such middleware should always have 4 params with err as the first one
*/
module.exports = ((err, req, res, next) => {

    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.satus || 'Error! Not sure what the hell went wrong...'
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  });
