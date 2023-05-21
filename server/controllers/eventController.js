const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const Club = require("../models/clubModel");
const Event = require("../models/eventModel");
const Participant = require("../models/participantModel");
const ErrorHandler = require("../utils/errorhandler");

// create event
exports.createEvent = catchAsyncErrors(async (req, res, next) => {
  const { name, club_id, description, scheduled_date } = req.body;
  const event = await Event.create({
    name,
    club_id,
    description,
    scheduled_date,
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

  const event = await Event.findOne({ _id: eventId }).exec();

  if (!event) {
    return res.status(404).json({ error: "Event not found." });
  }

  const club = await Club.findOne({ _id: event.club_id }).exec();
  if (!club) {
    return res.status(404).json({ error: "Club not found." });
  }
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

  return res.status(200).json({
    success: true,
    event: formattedEvent,
  });
});

// update event
exports.updateEvent = catchAsyncErrors(async (req, res, next) => {
  const { name, description, scheduled_date } = req.body;

  const event = await Event.findByIdAndUpdate(
    req.params.eventId,
    { name, description, scheduled_date },
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
      new ErrorHandler(`Event doesn't exist with id: ${req.params.event - id}`)
    );
  }

  await event.remove();

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
    res.status(400).json({
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
