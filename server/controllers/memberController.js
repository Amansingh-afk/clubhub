const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const Member = require("../models/memberModel");
const User = require("../models/userModel");

exports.subscribeMembership = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const clubId = req.params.club - id;

  await Member.create({
    userId,
    clubId,
  });

  res.status(201).json({
    success: true,
  });
});

exports.unsubscribeMembership = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const clubId = req.params.club - id;

  await Member.findByIdAndDelete(userId, clubId);
  res.status(200).json({
    success: true,
  });
});

exports.getAllMembersForClub = catchAsyncErrors(async (req, res, next) => {
  // find where clubId matches
  const ClubId = req.params.club-id;
  const members = await Member.find();
  res.status(200).json({
    success: true,
    members,
  });
});
