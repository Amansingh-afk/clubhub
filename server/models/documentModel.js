const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  club_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  doc_type: {
    type: String,
    required: true,
  },
  document: {
    type: String,
    required: true,
    enum: ["notice", "certificate"],
    default: "notice",
  },
  uploaded_on: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.Schema("Document", documentSchema);
