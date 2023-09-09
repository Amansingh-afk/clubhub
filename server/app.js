const express = require("express");
const cors = require('cors');

const app = express();
const errorMiddleware = require("./middlewares/errors");
const cookieParser = require("cookie-parser");


const corsOptions = {
    origin: 'https://clubhub-sms.netlify.app',
    credentials: true,
};


app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

const user = require("./routes/userRoute");
const club = require("./routes/clubRoute");
const event = require("./routes/eventRoute");
const member = require("./routes/memberRoute");

app.use("/api/v1", user);
app.use("/api/v1", club);
app.use("/api/v1", event);
app.use("/api/v1", member);

app.use(errorMiddleware);

module.exports = app;
