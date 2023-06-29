const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");

const Team = require("../models/teamModel");

exports.createTeam = catchAsyncErrors(async (req, res, next) => {
  const { name, description, event_id } = req.body;

  if (await Team.exists({ created_by: req.user.id })) {
    return res.status(400).json({
      success: false,
      error: "you have already created a team !!",
    });
  }

  await Team.create({
    name,
    description,
    event_id,
    created_by: req.user.id,
  });

  res.status(201).json({
    success: true,
  });
});
