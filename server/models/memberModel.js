const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  club_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reg_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Member", memberSchema);
