const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const Member = require("../models/memberModel");
const User = require("../models/userModel");

exports.subscribeMembership = catchAsyncErrors(async (req, res, next) => {
  const { userId, clubId } = req.body;

  const user = await Member.findOne({ user_id: userId, club_id: clubId });

  if (!user) {
    await Member.create({
      user_id: userId,
      club_id: clubId,
    });

    res.status(201).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Already a member!",
    });
  }
});

exports.unsubscribeMembership = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const clubId = req.params.club - id;

  await Member.findByIdAndDelete(userId, clubId);
  res.status(200).json({
    success: true,
  });
});
