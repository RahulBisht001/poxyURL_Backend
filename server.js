const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const linkRouter = require("./routes/LinkRoute");
const analyticsRouter = require("./routes/AnalyticsRoute");
const apiRouter = require("./routes/API-Route");

const connectDB = require("./database");
connectDB();

dotenv.config({
    path: "./env",
});

const app = express();
const PORT = process.env.PORT || 5000;

//?   CORS option

const corsOptions = {
    origin: ["https://poxyurl.in", "https://www.poxyurl.in", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(
    express.json({
        extended: true,
    })
);

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use("/api/service/v1", apiRouter);
app.use("/api/v1", linkRouter);
app.use("/api/v1", analyticsRouter);

app.get("/", (req, res) => {
    res.json({message: "Test message"});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
