const mongoose = require("mongoose");
const channelSchema = mongoose.Schema(
  {
    members: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Channel", channelSchema);
