const User = require("../models/userModel");

exports.registerUser = (req, res, next) => {
  res.status(201).json({ success: true, txt: "working buddy" });
};

exports.getAllUser = (req, res, next) => {
  const users = User.find();

  res.status(200).json({
    success: true,
    message: 'working',
    users,
  });
};
