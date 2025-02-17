const jwt = require("jsonwebtoken");

const URL = require("../models/LinkModel");
const Analytics = require("../models/AnalyticsModel");

const {getBrowserDetails, getLocationDetails} = require("../utils/analytics");

/**
 * This controller is used to generate a shortId for
 * given original URL.
 * This shortId and associated original URL are saved in the
 * Database so that when access the link from
 * shortId then the original url can be fetched from db
 */
const generateShortURL = async (req, res) => {
    try {
        console.log(req.body);
        const {originalUrl} = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                success: false,
                error: "URL is required",
            });
        }

        const {nanoid} = await import("nanoid");
        const shortId = nanoid(8);
        // console.log(shortId);

        await URL.create({
            originalUrl,
            shortId,
            clickCount: 0,
        });

        return res.status(200).json({
            message: "shortLink generated successfully",
            success: true,
            shortId,
        });
    } catch (error) {
        console.log(error);
        console.log("Error in the generateShortURL controller");
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

/**
 * This function will fetch the original URL from the
 * database using the shortId and redirect the user to the original URL.
 *
 * the shortId will be passed as parameter to the backend request
 */

const getOriginalURL = async (req, res) => {
    try {
        const shortId = req.params.shortId;

        // Check if the shortId is valid
        if (!shortId) {
            return res.json({
                success: false,
                error: "Invalid shortId",
            });
        }

        const data = await URL.findOne({shortId: shortId});

        const userAgentInfo = req.headers["useragentinfo"];
        // console.log(JSON.parse(userAgentInfo));

        const info = JSON.parse(userAgentInfo);

        // const browserDetails = getBrowserDetails(userAgent);
        // console.log(browserDetails);
        const locationDetails = await getLocationDetails();
        console.log(locationDetails);

        // Check if the URL is saved by an authenticated user
        if (data && data.savedBy) {
            const newAnalytics = await Analytics.create({
                shortId,
                browser: info?.browser?.name || "Other",
                os: info?.os?.name || "Other",
                device: info?.device?.type || "desktop",
                city: locationDetails?.city,
                country: locationDetails.country_name,
                accessedAt: new Date(),
            });

            // Update the URL document with the new analytics ID
            await URL.updateOne(
                {shortId},
                {
                    $push: {
                        analytics: newAnalytics._id,
                    },
                }
            );
        }

        // return await res.redirect(data.originalUrl);
        return res.json({
            success: true,
            originalUrl: data.originalUrl,
        });
    } catch (error) {
        console.log(error);
        console.log("Error in the getOriginalURL controller");
    }
};

const saveURL = async (req, res) => {
    try {
        const {shortId, linkName} = req.body;

        const authToken = req.headers.authorization;

        if (!shortId) {
            return res.status(400).json({
                success: false,
                error: "ShortId is required",
            });
        }

        // Validate authToken (example code, replace with your actual validation)
        if (!authToken || !authToken.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }

        // Clerk middleware attaches userId to req.auth.userId
        const token = authToken.split(" ")[1]; // Extract token

        const data = jwt.decode(token);
        const clerkId = data.sub;
        console.log(data.sub);

        const user = await URL.findOneAndUpdate(
            {shortId},
            {
                linkName,
                savedBy: clerkId,
            }
        );

        console.log(user);

        return res.status(200).json({
            success: true,
            message: "URL saved successfully",
        });
    } catch (error) {
        console.log(error);
        console.log("Error in saveURL controller");
    }
};

const getAllLinks = async (req, res) => {
    try {
        const authToken = req.headers.authorization;

        // Validate authToken (example code, replace with your actual validation)
        if (!authToken || !authToken.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }

        // Clerk middleware attaches userId to req.auth.userId
        const token = authToken.split(" ")[1]; // Extract token

        const data = jwt.decode(token);
        const clerkId = data.sub;
        console.log(data.sub);

        const urls = await URL.find({savedBy: clerkId});

        console.log(urls);

        res.status(200).json({
            success: true,
            urls,
        });
    } catch (error) {
        console.log(error);
        console.log("Error in getAllLinks controller");
    }
};

const deleteLink = async (req, res) => {
    try {
        const {shortId} = req.params;

        const authToken = req.headers.authorization;

        // Validate authToken (example code, replace with your actual validation)
        if (!authToken || !authToken.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }

        // Clerk middleware attaches userId to req.auth.userId
        const token = authToken.split(" ")[1]; // Extract user ui from token

        const data = jwt.decode(token);
        const clerkId = data.sub;

        // not just that you also need to delete
        // all the analytics related with this link

        // Optionally, delete related analytics
        // await Analytics.deleteMany({ shortId });

        // Delete the link if it exists and is associated with the logged-in user
        const url = await URL.findOneAndDelete({
            shortId,
            savedBy: clerkId,
        });

        if (!url) {
            return res.status(404).json({
                success: false,
                message: "Link not found or you are not authorized to delete this link",
            });
        }

        res.status(200).json({
            success: true,
            message: "Link deleted successfully",
        });
    } catch (error) {
        console.log(error);
        console.log("Error in deleteLink controller");
    }
};

const getLinkAnalytics = async (req, res) => {
    try {
        const {shortId} = req.params;
        console.log(shortId);
        const data = await Analytics.find({
            shortId,
        });

        console.log(data);

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.log(error);
        console.log("Error in getLinkAnalytics controller");
    }
};

module.exports = {generateShortURL, getOriginalURL, saveURL, getAllLinks, deleteLink, getLinkAnalytics};
