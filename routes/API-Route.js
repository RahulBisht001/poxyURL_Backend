const express = require("express");
const apiRouter = express.Router();

const {generateShortURLForAPI, getOriginalURLForAPI} = require("../API/API-Controller");

apiRouter.post("/shorten", generateShortURLForAPI);
apiRouter.get("/:shortId", getOriginalURLForAPI);

module.exports = apiRouter;
