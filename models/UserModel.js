const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        clerkId: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        displayName: {
            type: String,
        },
        avatarUrl: {
            type: String,
        },
        provider: {
            type: String,
            enum: ["clerk", "google", "github"],
            required: true,
        },
        // Add other fields as needed, such as tokens, settings, etc.
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
