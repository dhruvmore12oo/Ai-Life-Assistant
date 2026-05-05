const { errorResponse } = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler] ', err); // Minimal server-side logging

  // Handle Joi validation errors specifically
  if (err.isJoi) {
    return errorResponse(res, err.details[0].message, 400, err.details);
  }

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    return errorResponse(res, `File Upload Error: ${err.message}`, 400);
  }

  // Fallback for unhandled exceptions
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  errorResponse(res, message, statusCode);
};

module.exports = errorHandler;
