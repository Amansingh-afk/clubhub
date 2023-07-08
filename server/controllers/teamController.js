const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");

const Team = require("../models/teamModel");
const Participant = require("../models/participantModel");

// create team_events team
exports.createTeam = catchAsyncErrors(async (req, res, next) => {
  const { name, description, event_id, clubId } = req.body;

  if (await Team.exists({ event_id: event_id, created_by: req.user.id })) {
    return res.status(400).json({
      success: false,
      error: "you have already created a team !!",
    });
  }

  const team = await Team.create({
    name,
    description,
    event_id,
    created_by: req.user.id,
  });
  await Participant.create({
    event_id,
    user_id: req.user.id,
    club_member_id: clubId,
    team_id: team._id,
  })
  res.status(201).json({
    success: true,
  });
});

// join team_events team
exports.joinTeam = catchAsyncErrors(async (req, res, nect) => {
  const { clubId, eventId, userId, teamId } = req.body;

  const participant = await Participant.findOne({
    event_id: eventId,
    user_id: userId,
  });

  if (participant) {
    return res.status(400).json({
      success: false,
      error: "Already participated bro ..",
    });
  }

  await Participant.create({
    event_id: eventId,
    user_id: userId,
    club_member_id: clubId,
    team_id: teamId,
  });

  res.status(201).json({
    success: true,
  });
});
