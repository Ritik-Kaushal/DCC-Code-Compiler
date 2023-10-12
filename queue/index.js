const Bull = require("bull");

const compileCode = require("../queue/compileCode");
const getAllTestCases = require("../utils/getAllTestCases");
const runTestCases = require("../queue/runTestCases");
const Submission = require("../models/submission");
const { deleteFile } = require("../utils/fileOperations");

const CompilerQueue = new Bull("CompilerQueue");

const updateCompilationError = async (submission_id, error) => {
  // console.log(submission_id, error);
  try {
    const submission = await Submission.findById(submission_id);
    submission.verdict = "Compilation Error";
    submission.error = error;
    submission.save();
  } catch (err) {
    console.log("Error while updating compilation error in database");
  }
};

CompilerQueue.process(5, async (job, done) => {
  try {
    const { code, ques_id, submission_id, testing, username, contest_id, isContestRunning } = job.data;
    const { executableFileName, CPPFileName, error } = await compileCode(code);
    if (error) {
      console.log("Error while compiling code", error);
      await updateCompilationError(submission_id, error);
      done(error);
      return;
    }
    const testCases = await getAllTestCases(ques_id);
    const result = await runTestCases(
      username,
      executableFileName,
      ques_id,
      testCases,
      submission_id,
      testing,
      isContestRunning,
      contest_id
    );
    deleteFile(executableFileName);
    deleteFile(CPPFileName);
    done();
  } catch (err) {
    console.log(err);
    done(err);
  }
});

CompilerQueue.on("completed", (job) => {
  console.log(`Job completed with result ${job.data.submission_id}`);
});

module.exports = { CompilerQueue };
