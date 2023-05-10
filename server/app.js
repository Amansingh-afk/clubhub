const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/errors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const user = require("./routes/userRoute");
const club = require("./routes/clubRoute");
const event = require("./routes/eventRoute");
app.use("/api/v1", user);
app.use("/api/v1", club);
app.use("/api/v1", event);

app.use(errorMiddleware);

module.exports = app;
