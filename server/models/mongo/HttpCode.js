const { Schema } = require("mongoose");
const conn = require("../../lib/mongo");

const HttpCodeSchema = new Schema({
  code: {
    type: Number,
    min: 100,
    max: 599,
  },
  message: String,
  description: String,
});

const HttpCode = conn.model("HttpCode", HttpCodeSchema);

module.exports = HttpCode;
