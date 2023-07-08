const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");

const User = require("../models/userModel");
const Club = require("../models/clubModel");
const Event = require("../models/eventModel");
const Team = require("../models/teamModel");
const Participant = require("../models/participantModel");

// create event
exports.createEvent = catchAsyncErrors(async (req, res, next) => {
  const { name, club_id, description, scheduled_date, event_type } = req.body;

  const event = await Event.create({
    name,
    club_id,
    description,
    scheduled_date,
    event_type,
  });

  res.status(201).json({
    success: true,
  });
});

// get all events for a club
exports.getEventByClubId = catchAsyncErrors(async (req, res, next) => {
  const clubId = req.body.club_id;

  const events = await Event.findOne({ club_id: clubId });

  if (!events) {
    return next(new ErrorHandler("No Events found", 404));
  }
  res.status(200).json({
    success: true,
    events,
  });
});

// get event details by event_id
exports.getEventDetail = catchAsyncErrors(async (req, res, next) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;

  const event = await Event.findOne({ _id: eventId }).exec();

  if (!event) {
    return res.status(404).json({ error: "Event not found." });
  }

  let team = [];
  if (event.event_type === "team") {
    team = await Team.find({ event_id: eventId })
      .populate("created_by", "name roll_no")
      .exec();
  }
  const club = await Club.findOne({ _id: event.club_id }).exec();

  if (!club) {
    return res.status(404).json({ error: "Club not found." });
  }
  const isAdmin = club.admin_id == userId;

  const participants = await Participant.find({
    event_id: eventId,
    $or: [
      { team_id: { $ne: null } }, // Fetch participants for team events
      { team_id: null }, // Fetch participants for individual event
    ],
  })
    .populate("team_id", "name")
    .populate("user_id", "")
    .exec();

  const participantData = participants.map((participant) => {
    const { user_id, team_id } = participant;
    const userData = user_id._doc; // Get all fields of the user
    const teamName = team_id ? team_id.name : null; // Get the team name if available

    return {
      ...userData,
      team_name: teamName,
    };
  });
  const formattedDate = event.scheduled_date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedEvent = {
    ...event._doc,
    club_name: club.name,
    scheduled_date: formattedDate,
  };

  const hasParticipated = participants.some(
    (participant) => participant.user_id._id.toString() === userId
  );

  return res.status(200).json({
    success: true,
    isAdmin,
    hasParticipated,
    event: formattedEvent,
    participants: participantData,
    team,
  });
});

// update event
exports.updateEvent = catchAsyncErrors(async (req, res, next) => {
  const { name, description, scheduled_date, event_type } = req.body;

  const event = await Event.findByIdAndUpdate(
    req.params.eventId,
    { name, description, scheduled_date, event_type },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// delete a event
exports.deleteEvent = catchAsyncErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) {
    return next(
      new ErrorHandler(`Event doesn't exist with id: ${req.params.eventId}`)
    );
  }
  const participants = await Participant.deleteMany({
    event_id: req.params.eventId,
  });

  const teams = await Team.deleteMany({ event_id: req.params.eventId });

  await event.remove();

  res.status(200).json({
    success: true,
  });
});

// set event as completed
exports.setEventAsCompleted = catchAsyncErrors(async (req, res, next) => {
  const { isCompleted } = req.body;
  await Event.findByIdAndUpdate(
    req.params.eventId,
    { has_completed: isCompleted },
    { new: true, runValidators: true, useFindAndModify: false }
  );

  res.status(200).json({
    success: true,
  });
});

// get all events
exports.getAllEvents = catchAsyncErrors(async (req, res, next) => {
  const events = await Event.find();

  const formattedEvents = await Promise.all(
    events.map(async (event) => {
      const club = await Club.findById(event.club_id);
      const formattedDate = event.scheduled_date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return {
        _id: event._id,
        name: event.name,
        club_id: event.club_id,
        club_name: club ? club.name : null,
        scheduled_date: formattedDate,
        description: event.description,
        event_type: event.event_type,
      };
    })
  );

  res.status(200).json({
    success: true,
    events: formattedEvents,
  });
});

exports.joinEvent = catchAsyncErrors(async (req, res, next) => {
  const { clubId, eventId, userId } = req.body;

  const participant = await Participant.findOne({
    event_id: eventId,
    user_id: userId,
  });

  if (participant) {
    return res.status(400).json({
      success: false,
      error: "Already participated in this event.",
    });
  }

  await Participant.create({
    event_id: eventId,
    user_id: userId,
    club_member_id: clubId,
  });

  res.status(201).json({
    success: true,
  });
});

exports.leaveEvent = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.params.eventId;

  await Participant.findOneAndDelete({ user_id: userId, event_id: eventId });

  res.status(200).json({
    success: true,
  });
});

exports.removeParticipant = catchAsyncErrors(async (req, res, next) => {
  const { userId, eventId } = req.body;

  await Participant.findOneAndDelete({ user_id: userId, event_id: eventId });
  res.status(200).json({
    success: true,
    msg: "yes",
  });
});
