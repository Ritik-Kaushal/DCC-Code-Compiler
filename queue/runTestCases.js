const runWithInput = require("./runCompiledCode");
const validateOutput = require("../utils/validateOutput");
const Submission = require("../models/submission");

const updateRuntimeError = async (submission_id, error) => {
  try {
    const submission = await Submission.findById(submission_id);
    submission.verdict = "Runtime Error";
    submission.save();
    submission.error = error;
  } catch (err) {
    console.log("Error while updating runtime error in database");
  }
};

const updateWrongAnswer = async (submission_id) => {
  try {
    const submission = await Submission.findById(submission_id);
    submission.verdict = "Wrong Answer";
    submission.save();
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

const runTestCases = async (compiledExecutable, testCases, submission_id) => {
  try {
    let time_taken = 0;
    for (const testCase of testCases) {
      const result = await runWithInput(compiledExecutable, testCase.input);
      if (result.executionTime >= 4000) {
        updateTimeLimitExceeded(submission_id, result.executionTime);
        console.log("Time Limit Exceeded Error", result.executionTime);
        return;
      }
      if (result.stderr) {
        updateRuntimeError(submission_id, result.stderr);
        console.log("Runtime Error", result.stderr);
        return;
      }
      if (!validateOutput(result.stdout, testCase.output)) {
        updateWrongAnswer(submission_id);
        console.log("Wrong Answer");
        return;
      }
      time_taken = Math.max(time_taken, result.executionTime);
    }
    const submission = await updateAccepted(submission_id, time_taken);
    console.log("Accepted");
  } catch (error) {
    console.error("Error running code:", error);
  }
};

module.exports = runTestCases;
