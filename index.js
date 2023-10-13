const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { createClient } = require("redis");

const app = express();
const bodyParser = require("body-parser");

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const client = createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

const CompilerRouter = require("./routes/Compiler/index");

const uri = process.env.CONNECTION_URL;

try {
  app.listen(3000, async () => {
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Server running on port 5001 & database is connected");
      });
  });
} catch (err) {
  console.log(err);
}

app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.use("/api", CompilerRouter);

module.exports = app; // Export the app for testing or use in other modules
