const regexList = require("../detectors/regexList");

function scrub(text) {
  let scrubbed = text;

  regexList.forEach(item => {
    scrubbed = scrubbed.replace(item.regex, "<REDACTED>");
  });

  return scrubbed;
}

const originalLog = console.log;

console.log = (...args) => {
  const safeArgs = args.map(a =>
    typeof a === "string" ? scrub(a) : a
  );

  originalLog(...safeArgs);
};

module.exports = {};
