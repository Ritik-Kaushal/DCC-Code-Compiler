const { spawn } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const {
  writeFile,
  ensureDirectoryExistence,
} = require("../utils/fileOperations");

const fileFolder = "./user_code_files/";

// Promisify the spawn function for easier use
const promisifySpawn = (command, args) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);
    process.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error("Compilation failed. Please check your code. "));
      }
    });
    process.stderr.on("data", (data) => {
      reject(new Error(data.toString()));
    });
  });
};

// Compile C++ code
const compileCPlusPlusCode = async (sourceFileName, executableFileName) => {
  const compileCommand = "g++";
  const args = [
    `${fileFolder}${sourceFileName}`,
    "-o",
    `${fileFolder}${executableFileName}`,
  ];
  await promisifySpawn(compileCommand, args);
};

// Middleware to compile user-submitted code
const compileCode = async (code) => {
  try {
    const uniqueFileName = `user_code_${uuidv4()}.cpp`;
    const executableFileName = `${uuidv4()}_executable`;
    const filePath = `${fileFolder}${uniqueFileName}`;
    const executableFileNameWithPath = `${fileFolder}${executableFileName}`;
    await ensureDirectoryExistence(filePath);
    await writeFile(filePath, code);
    await compileCPlusPlusCode(uniqueFileName, executableFileName);
    return {
      executableFileName: executableFileNameWithPath,
      CPPFileName: filePath,
    };
  } catch (error) {
    // console.error("Error while Compiling : ", error);
    return { error };
  }
};

module.exports = compileCode;
