const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const crypto = require("crypto");
const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendmail");

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
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("Invalid Credentials, Please try again!", 401)
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(
      new ErrorHandler("Invalid Credentials, Please try again!", 401)
    );
  }

  sendToken(user, 200, res);
});

// Logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null),
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
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  //resetPassword token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;

  const message = `Your password reset token is: \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please igonore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Clubhub Password recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// resetpsswrd token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.param.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

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
