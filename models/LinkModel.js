const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true,
        },
        shortId: {
            type: String,
            required: true,
            unique: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        linkName: {
            type: String,
            default: "Untitled Link",
        },
        savedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        analytics: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Analytics",
            },
        ],
    },
    {timestamps: true}
);

const URL = mongoose.model("URL", UrlSchema);
module.exports = URL;
