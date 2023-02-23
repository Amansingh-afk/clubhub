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
  const club = await Club.findOne({ admin_id: req.user.id }); // where admin_id = req.user.id

  if (!club) {
    return next(new ErrorHandler("Club not found", 404));
  }
  res.status(200).json({
    success: true,
    club,
  });
});

// update club detail
exports.updateClubDetail = catchAsyncErrors(async (req, res, next) => {
  const newClubData = {
    name: req.body.name,
    description: req.body.description,
  };

  const club = await Club.findByIdAndUpdate(req.params.club-id, newClubData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// delete a club
exports.deleteClub = catchAsyncErrors(async (req, res, next) => {
  const club = await Club.findById(req.params.club-id);
  if (!club) {
    return next(
      new ErrorHandler(`club doesn't exist with club id: ${req.params.club_id}`)
    );
  }
  await club.remove();

  res.status(200).json({
    success: true,
    msg: "Club deleted successfully",
  });
});

// get all clubs
exports.getAllClubs = catchAsyncErrors(async (req, res, next) => {
  const clubs = await Club.find();

  res.status(200).json({
    success: true,
    clubs,
  });
});
