const { Schema } = require("mongoose");
const conn = require("../../lib/mongo");

const ConversionRateSchema = new Schema({
    baseCurrency: String,
    targetCurrency: String,
    date: String,
    rate: Number,
});

const ConversionRate = conn.model("ConversionRate", ConversionRateSchema);

module.exports = ConversionRate;