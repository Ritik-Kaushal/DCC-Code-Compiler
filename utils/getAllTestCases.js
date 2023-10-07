const Question = require("../models/question");

const getAllTestCases = async (questionId) => {
  const question = await Question.findOne({ _id: questionId }).exec();
  const publicTestCases = question.public_test_cases;
  const privateTestCases = question.private_test_cases;

  const testCases = publicTestCases.concat(privateTestCases);
  return testCases;
};

module.exports = getAllTestCases;
