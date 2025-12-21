const ErrorHandler = require('../utils/Error_handler');

// Define the middleware function first
const errorMiddleware = (err, req, res, next) => {
  // Set default values if not already set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development environment
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR', err);
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack
    });
  }

  // Production environment
  if (process.env.NODE_ENV === 'production') {
    if (!err.isOperational) {
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
};

// Export the variable at the end
module.exports = errorMiddleware;
