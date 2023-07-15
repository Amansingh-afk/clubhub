const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userModel");
const Event = require("./eventModel");
const Club = require("./clubModel");
const Team = require("./teamModel");

const participantSchema = new Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  club_member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true,
  },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: null,
  },
});
module.exports = mongoose.model("Partcipant", participantSchema);
