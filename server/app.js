require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const port = process.env.PORT;

// Create the Express application
var app = express();

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require("./config/database");

// Must first load the models
require("./models/user");

// Pass the global passport object into the configuration function
require("./config/passport")(passport);

const { connectDB } = require("./config/database");
connectDB();

// This will initialize the passport object on every request
app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.FRONT_END,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH"],
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
  })
);

app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.urlencoded({ extended: true })(req, res, next);
  }
});

// Imports all of the routes from ./routes/index.js
app.use(require("./routes/index"));

//watch collections
// require("./lib/algoliaSearch").watchProductCollection();

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3001
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
