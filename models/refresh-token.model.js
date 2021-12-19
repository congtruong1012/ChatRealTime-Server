const mongoose = require("mongoose");
const refreshTokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("refresh-token", refreshTokenSchema);
