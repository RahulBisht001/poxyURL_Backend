const URL = require("../models/LinkModel");

const generateShortURLForAPI = async (req, res) => {
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
        const shortId = nanoid(7);
        console.log(shortId);

        await URL.create({
            originalUrl,
            shortId,
        });

        return res.status(200).json({
            message: "shortLink generated successfully",
            success: true,
            shortLink: `${process.env.FRONTEND_URL}/${shortId}`,
        });
    } catch (error) {
        console.log(error);
        console.log("Error in the generateShortURL controller");
    }
};

const getOriginalURLForAPI = async (req, res) => {
    try {
        const {shortId} = req.params;
        const url = await URL.findOne({shortId});

        if (!url) {
            return res.status(404).json({
                success: false,
                error: "URL not found",
            });
        }

        console.log(url);

        return res.redirect(url.originalUrl);
    } catch (error) {
        console.log(error);
        console.log("Error in the getOriginalURL controller");
    }
};

module.exports = {
    generateShortURLForAPI,
    getOriginalURLForAPI,
};
