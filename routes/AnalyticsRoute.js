const express = require("express");
const analyticsRouter = express.Router();

const {recordAnalytics, getAnalytics} = require("../controller/AnalyticsController");

analyticsRouter.post("/analytics/record", recordAnalytics);
analyticsRouter.get("/analytics/:shortId", getAnalytics);

module.exports = analyticsRouter;
