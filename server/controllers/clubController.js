const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const Club = require("../models/clubModel");
const User = require("../models/userModel");
const Member = require("../models/memberModel");

// create club
exports.createClub = catchAsyncErrors(async (req, res, next) => {
  const { name, adminUsername, description, banner } = req.body;

  const user = await User.findOne({ username: adminUsername });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: "User doesn't exist !!",
    });
  }
  // Check if the user is already an admin of a club
  if (await Club.exists({ admin_id: user._id })) {
    return res.status(400).json({
      success: false,
      error: "user is already an admin of a club.",
    });
  }

  user.role = "admin";
  await user.save();

  const club = await Club.create({
    name,
    admin_id: user._id,
    description,
    banner,
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
    return res.status(404).json({
      success: false,
      error: "Club not found",
    });
  }

  res.status(200).json({
    success: true,
    club,
  });
});

// get single club details
exports.getClubData = catchAsyncErrors(async (req, res, next) => {
  const clubId = req.params.clubId;

  const club = await Club.findOne({ _id: clubId }).lean().exec();

  if (!club) {
    return res.status(404).json({ error: "Club not found" });
  }

  const members = await Member.find({ club_id: clubId }).exec();

  const admin = await User.findOne({ _id: club.admin_id }).exec();
  club.admin = {
    _id: admin._id,
    name: admin.name,
    username: admin.username,
  };

  res.status(200).json({ club, members });
});

// update club detail
exports.updateClubDetail = catchAsyncErrors(async (req, res, next) => {
  const { name, adminUsername, description, banner } = req.body;

  const user = await User.findOne({ username: adminUsername });

  const newClubData = {
    name: name,
    admin_id: user._id,
    description,
    banner,
  };
  const club = await Club.findByIdAndUpdate(req.params.clubId, newClubData, {
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
  const club = await Club.findById(req.params.clubId);
  if (!club) {
    return next(
      new ErrorHandler(`club doesn't exist with club id: ${req.params.clubId}`)
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

  const clubsWithAdminName = await Promise.all(
    clubs.map(async (club) => {
      const { _id, name, admin_id, description, banner } = club;

      const admin = await User.findById(admin_id);
      const adminName = admin ? admin.name : "Unknown";

      return {
        _id,
        name,
        admin_id,
        adminName,
        description,
        banner,
      };
    })
  );
  res.status(200).json({
    success: true,
    clubs: clubsWithAdminName,
  });
});
