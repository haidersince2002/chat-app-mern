// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Default error response
  const errorResponse = {
    status: err.status || 500,
    message: err.message || "Internal Server Error",
    extraDetails: err.extraDetails || "Error middleware handler",
  };

  // Send error response
  res.status(errorResponse.status).json(errorResponse);
};

export default errorHandler;
