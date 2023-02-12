const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clubSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please, Provide Club Name"],
  },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
  },
  banner: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("Club", clubSchema);
