const { spawn } = require("child_process");

const runWithInput = async (compiledCodePath, input) => {
  console.log(compiledCodePath);
  return new Promise((resolve) => {
    const startTime = new Date();
    const child = spawn(compiledCodePath);
    child.stdin.setEncoding("utf-8");
    child.stdin.write(input);
    child.stdin.end();

    let responseData = {
      stdout: "",
      stderr: "",
      executionTime: 0,
    };

    const timer = setTimeout(() => {
      responseData.stderr += "Process terminated due to timeout.";
      child.kill();
    }, 4000); // 7 seconds


    // Kill the process if memory limit exceeds i.e. if data cannot be converted to string due to memory exceeding
    child.stdout.on("data", (data) => {
      try {
        responseData.stdout += data.toString();
      }
      catch (err) {
        // output too big to be converted to string
        responseData.mle = "Memory Limit Exceeded";
        child.kill();
      }
    });

    child.stderr.on("data", (data) => {
      try {
        responseData.stderr += data.toString();
      }
      catch (err) {
        // output too big to be converted to string
        responseData.mle = "Memory Limit Exceeded";
        child.kill();
      }
    });

    child.on("error", (error) => {
      responseData.error = error.message;
      clearTimeout(timer); // Clear the timer
      resolve(responseData);
    });

    child.on("close", (code) => {
      const endTime = new Date();
      responseData.exitCode = code;
      responseData.executionTime = endTime - startTime; // Calculate execution time in milliseconds
      clearTimeout(timer); // Clear the timer
      resolve(responseData);
    });
  });
};

module.exports = runWithInput;
