const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const Event = require("../models/eventModel");

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
