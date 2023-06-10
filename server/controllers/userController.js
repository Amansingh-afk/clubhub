const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const sendToken = require("../utils/jwttoken");

// Create user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { fullname, username, email, password, course, semester, roll_no } =
    req.body;

  const user = await User.create({
    name: fullname,
    username,
    email,
    password,
    course,
    semester,
    roll_no,
    avatar: {
      public_id: "this is public id",
      url: "avatar_url",
    },
  });

  sendToken(user, 201, res);
});

// Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password } = req.body;
  let user;
  if (username) {
    user = await User.findOne({ username }).select("+password");
  } else if (email) {
    user = await User.findOne({ email }).select("+password");
  }

  if (!user) {
    return next(new ErrorHandler("Invalid Credentials", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid Credentials", 401));
  }

  sendToken(user, 200, res);
});

// Logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token",null),
    {
      expires: new Date(Date.now()),
      httpOnly: true,
    };

  res.status(200).json({
    success: true,
    message: "logged out",
  });
});
// forgot password

// Get user details, profile details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Password update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

// User Profile update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newProfileData = {
    name: req.body.name,
    email: req.body.email,
    phone_no: req.body.phone_no,
    avatar: req.body.avatar,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newProfileData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    user,
    success: true,
  });
});

// Get all user -- super admin
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user --super admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update user role --super admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newRole = {
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newRole, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//delete user --super admin
exports.deleteuser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id: ${req.params.id}`)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
