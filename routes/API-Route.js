const express = require("express");
const apiRouter = express.Router();

const {rateLimit} = require("express-rate-limit");

const {generateShortURLForAPI, getOriginalURLForAPI} = require("../API/API-Controller");

// Rate limiter for generating short URLs
const shortURL_API_RateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 12, // Limit each IP to 10 requests per window
    message: {
        success: false,
        error: "Too many requests, please try again later.",
    },
});

// Rate limiter for getting original URLs
const getOriginal_URL_API_RateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // Limit each IP to 60 requests per window
    message: {
        success: false,
        error: "Too many requests, please try again later.",
    },
});

apiRouter.post("/shorten", shortURL_API_RateLimiter, generateShortURLForAPI);
apiRouter.get("/:shortId", getOriginal_URL_API_RateLimiter, getOriginalURLForAPI);

module.exports = apiRouter;
