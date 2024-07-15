const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
    const URI = process.env.MONGO_URI;
    try {
        const {connection} = await mongoose.connect(URI, {});

        console.log(`Database connected successfully: ${connection.host}`);
    } catch (error) {
        console.log(error);
        console.log("Database Error Brother");
    }
};

module.exports = connectDB;
