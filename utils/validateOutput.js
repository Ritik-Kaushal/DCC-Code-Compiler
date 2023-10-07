const validateOutput = (output, expectedOutput) => {
  const trimmedOutput = output
    .trim()
    .replace(/\n/g, " ")
    .replace(/\s\s+/g, " ");
    
  const trimmedExpectedOutput = expectedOutput
    .trim()
    .replace(/\n/g, " ")
    .replace(/\s\s+/g, " ");
  return trimmedOutput === trimmedExpectedOutput;
};

module.exports = validateOutput;
