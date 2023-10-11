const addToDatabase = require("../utils/addSubmissionToDatabase");

const createSubmissionToDatabase = async (req, res, next) => {
  try {
    const { success, message } = await addToDatabase(req);
    if (success) {
      next();
    } else {
      return res.status(400).json({ message: message });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createSubmissionToDatabase,
};
