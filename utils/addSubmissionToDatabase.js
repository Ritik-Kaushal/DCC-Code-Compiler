const Submission = require("../models/submission");
const moment = require("moment");
const isContestRunning = require("../utils/isContestRunning");

const validateParameters = (req, res) => {
  const { code, username, ques_id, ques_name, lang } = req.body;

  if (!code || !username || !ques_id || !ques_name || !lang) {
    return false;
  }

  return true;
};

const checkQuestionParticipation = async (contest_id, ques_id) => {
  const { verdict, ques_ids, end_time } = await isContestRunning(contest_id);

  if (verdict && !ques_ids.includes(ques_id)) {
    return { success: false, message: "Question is not part of the contest" };
  }
  return { success: true, verdict, end_time };
};

const createSubmission = (req, display_after, currTime) => {
  const { code, username, ques_id, lang, ques_name, contest_id, testing } =
    req.body;
  return new Submission({
    language: lang,
    display_after,
    time_stamp: currTime,
    code,
    username,
    ques_id,
    ques_name,
    contest_id,
    testing,
  });
};

const addToDatabase = async (req) => {
  try {
    if (!validateParameters(req)) {
      return { success: false, message: "Parameters are Missing" };
    } else {
      const { success, verdict, end_time } = await checkQuestionParticipation(
        req.body.contest_id,
        req.body.ques_id
      );
      if (!success) {
        return {
          success: false,
          message: "Question is not part of the contest",
        };
      }
      const currTime = moment().format("DD/MM/YYYY HH:mm");
      const display_after = verdict ? end_time : currTime;

      const submission = createSubmission(req, display_after, currTime);

      await submission.save();
      req.body.submission_id = submission._id;
      req.body.isContestRunning = verdict;

      return { success: true, message: "Added to database" };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Failed To Submit To Database" };
  }
};

module.exports = addToDatabase;
