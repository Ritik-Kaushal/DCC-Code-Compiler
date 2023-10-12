const runWithInput = require("./runCompiledCode");
const validateOutput = require("../utils/validateOutput");
const Submission = require("../models/submission");
const User = require("../models/user");
const Contest = require("../models/contest");
const Question = require("../models/question");

const updateMemoryLimitExceededError = async (submission_id) => {
  try {
    const submission = await Submission.findById(submission_id);
    submission.verdict = "Memory Limit Exceeded";
    await submission.save();
  } catch (err) {
    console.log("Error while updating memory limit error in database");
  }
};

const updateRuntimeError = async (submission_id, error) => {
  try {
    const submission = await Submission.findById(submission_id);
    submission.verdict = "Runtime Error";
    submission.error = error;
    await submission.save();
  } catch (err) {
    console.log("Error while updating runtime error in database");
  }
};

const updateWrongAnswer = async (submission_id) => {
  try {
    const submission = await Submission.findById(submission_id);
    submission.verdict = "Wrong Answer";
    await submission.save();
  } catch (err) {
    console.log("Error while updating wrong answer in database");
  }
};

const updateAccepted = async (submission_id, time_taken) => {
  const submission = await Submission.findByIdAndUpdate(
    submission_id,
    {
      $set: {
        verdict: "Accepted",
        time_taken: time_taken,
      },
    },
    { new: true }
  );
  return submission;
};

const updateTimeLimitExceeded = async (submission_id, time_taken) => {
  const submission = await Submission.findByIdAndUpdate(
    submission_id,
    {
      $set: {
        verdict: "Time Limit Exceeded",
        time_taken: time_taken,
      },
    },
    { new: true }
  );
  console.log(submission)
  return submission;
};

const runTestCases = async (username, compiledExecutable, ques_id, testCases, submission_id, testing, isContestRunning, contest_id) => {
  try {
    let time_taken = 0;
    for (const testCase of testCases) {
      const result = await runWithInput(compiledExecutable, testCase.input);

      // Check for Memory Limit Error
      if (result.mle) {
        updateMemoryLimitExceededError(submission_id);
        console.log("Memory Limit Exceeded Error");
        return;
      }

      // Check for runtime error
      if (result.stderr) {
        updateRuntimeError(submission_id, result.stderr);
        console.log("Runtime Error", result.stderr);
        return;
      }

      // Check for timelimit error
      if (result.executionTime >= 4000) {
        updateTimeLimitExceeded(submission_id, result.executionTime);
        console.log("Time Limit Exceeded Error", result.executionTime);
        return;
      }
      // console.log(Buffer.byteLength(result.stdout, 'utf8') / (1024 * 1024));
      // Validate output
      if (!validateOutput(result.stdout, testCase.output)) {
        updateWrongAnswer(submission_id);
        console.log("Wrong Answer");
        return;
      }
      time_taken = Math.max(time_taken, result.executionTime);
    }
    const submission = await updateAccepted(submission_id, time_taken, testing);

    const ques = await Question.findOne({ _id: ques_id }, "ques_id").exec();
    if (!testing) await User.updateSolved(ques.ques_id, username);
    if (isContestRunning) await Contest.updateResult(contest_id, ques.ques_id, username);

    console.log("Accepted");
  } catch (error) {
    console.error("Error running code:", error);
  }
};

module.exports = runTestCases;
