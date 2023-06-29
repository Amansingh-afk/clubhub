const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Provide a name for event"],
  },
  club_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  scheduled_date: {
    type: Date,
    required: true,
  },
  event_type: {
    type: String,
    required: true,
    enum: ["individual", "team"],
    default: "individual",
  },
  has_completed: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
