const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const Event = require("../models/eventModel");
const ErrorHandler = require("../utils/errorhandler");

// create event
exports.createEvent = catchAsyncErrors(async (req, res, next) => {
  const { name, club_id, description, scheduled_date } = req.body;
  const event = new Event.create({
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

// update event
exports.updateEvent = catchAsyncErrors(async (req, res, next) => {
  const eventData = {
    name: req.body.name,
    description: req.body.description,
    scheduled_date: req.body.scheduled_date,
  };

  const event = await Event.findByIdAndUpdate(
    req.params.event - id,
    eventData,
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
  const event = await Event.findById(req.params.event - id);
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

  res.status(200).json({
    success: true,
    events,
  });
});
