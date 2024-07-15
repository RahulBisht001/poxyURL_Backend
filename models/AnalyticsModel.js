const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
    }, // Assuming shortId as identifier
    browser: {
        type: String,
    },
    os: {
        type: String,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    accessedAt: {
        type: Date,
        default: Date.now,
    },
    referrer: {
        type: String,
    },
});

const Analytics = mongoose.model("Analytics", AnalyticsSchema);

module.exports = Analytics;
