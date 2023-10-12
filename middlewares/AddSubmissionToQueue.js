const { CompilerQueue } = require("../queue/index");

const addToQueue = async (req, res, next) => {
  try {
    const { submission_id, isContestRunning, testing, ques_id, code } = req.body;
    const job = await CompilerQueue.add({
      submission_id: submission_id,
      isContestRunning: isContestRunning,
      username: req.body.username,
      contest_id: req.body.contest_id,
      testing: testing,
      ques_id: ques_id,
      code: code,
    });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Failed To Add To Queue" });
  }
};

module.exports = {
  addToQueue,
};


