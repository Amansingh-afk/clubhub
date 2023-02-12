const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const Club = require("../models/clubModel");
const Member = require("../models/memberModel");
const Event = require("../models/eventModel");

// create club
exports.createClub = catchAsyncErrors(async (req, res, next) => {
  const { name, admin_id } = req.body;
  const club = await Club.create({
    name,
    admin_id,
    avatar: {
      public_id: "sample pub id",
      url: "urlxxx",
    },
  });
  res.status(201).json({
    success: true,
    club,
  });
});

// get club detail when admin logins
exports.getClubDetail = catchAsyncErrors(async (req, res, next) => {
  const club = await Club.findById(req.user.id); // where admin_id = req.user.id

  res.status(200).json({
    success: true,
    club,
  });
});

// update club detail
exports.updateClubDetail = catchAsyncErrors(async (req, res, next) => {
  const newClubData = {
    name: req.body.name,
    admin_id: req.body.admin_id,
  };

  const club = await Club.findByIdAndUpdate(req.body.club_id, newClubData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// get all members of a club
exports.getAllMembers = catchAsyncErrors(async (req, res, next) => {
  const members = await Member.find(); // where club_id = req.body.club_id

  res.status(200).json({
    success: true,
    members,
  });
});

// get all events of a club
exports.getAllEvents = catchAsyncErrors(async (req, res, next) => {
  const events = await Event.find(); // where where club_id = req.body.club_id

  req.status(200).json({
    success: true,
    events,
  });
});
