const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //Cast error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate $(object.keys(err.keyValue)) Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong jwt error
  if (err.code === "JsonWebTokenError") {
    const message = "Json web Token is invalid, Try again";
    err = new ErrorHandler(message, 400);
  }

  //JWT expire error
  if (err.code === "TokenExpireError") {
    const message = "Json web Token is Expired, Try again ";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
