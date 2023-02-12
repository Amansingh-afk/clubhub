const mongoose = require("mongoose");
const Schema = new mongoose.Schema();

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
});

module.exports = mongoose.model("Event", eventSchema);
