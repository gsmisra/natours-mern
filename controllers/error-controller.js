/* 
  Global middleware function for error handling 
  Note such middleware should always have 4 params with err as the first one
*/
module.exports = ((err, req, res, next) => {
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.satus || 'DEV ERR: Not sure what the hell went wrong...';

    if(process.env.NODE_ENV === 'development'){
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        errorStack: err.stack
      });
    } else if(process.env.NODE_ENV === 'production'){
      if(err.isOperational){    //isOperational is comming from app-error class
        res.status( err.statusCode).json({
          status: `PROD ERR - API call failed!`,
          message: `PROD ERR: ${err.message}`
        });
      }
      else{
        console.error(err.stack);
        res.status(500).send('Generic error mesage... Contact the dev team.');
      }
    }
  });
