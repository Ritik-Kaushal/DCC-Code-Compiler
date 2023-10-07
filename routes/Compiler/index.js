const express = require("express");
const {
  createSubmissionToDatabase,
} = require("../../middlewares/CreateSubmissionToDatabase");
const addToDatabase = require("../../utils/addSubmissionToDatabase");
const Router = express.Router();
const { addToQueue } = require("../../middlewares/AddSubmissionToQueue");

Router.post(
  "/compileWithInput",
  createSubmissionToDatabase,
  addToQueue,
  (req, res) => {
    return res.status(200).json({
      message: "Successfully added to database",
      submission_id: req.body.submission_id,
    });
  }
);

module.exports = Router;
