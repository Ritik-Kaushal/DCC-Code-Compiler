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

    child.stdout.on("data", (data) => {
      responseData.stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      responseData.stderr += data.toString();
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
