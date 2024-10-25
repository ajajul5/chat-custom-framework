const ErrorHandler = (err, req, res, next) => {
    console.log('ajajul',err); // Log the error for debugging (optional)
  
    // Set status code (use the custom status code or default to 500)
    const statusCode = err.statusCode || 500;
  
    // Send JSON response
    res.status(statusCode).json({
      success: false,
      error: err.name || 'InternalServerError', // Name of the error (e.g., 'RecordNotFoundException')
      message: err.message || 'Something went wrong', // Message from the error
    });
  };
  
  module.exports = ErrorHandler;