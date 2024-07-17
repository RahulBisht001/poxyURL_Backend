const express = require("express");
const linkRouter = express.Router();

const {
    generateShortURL,
    getOriginalURL,
    saveURL,
    getAllLinks,
    deleteLink,
    getLinkAnalytics,
} = require("../controller/LinkController");

linkRouter.post("/shorten", generateShortURL);
linkRouter.get("/id/:shortId", getOriginalURL);
linkRouter.post("/saveUrl", saveURL);
linkRouter.get("/links/all", getAllLinks);
linkRouter.get("/link/:shortId", getLinkAnalytics);
linkRouter.delete("/link/:shortId", deleteLink);

module.exports = linkRouter;
