const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participantSchema = new Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  club_member_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
module.exports = mongoose.model("Partcipant", participantSchema);
