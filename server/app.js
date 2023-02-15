const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const user = require("./routes/userRoute");
const club = require("./routes/clubRoute");

app.use("/api/v1", user);
app.use("/api/v1", club);

app.use(errorMiddleware);

module.exports = app;
