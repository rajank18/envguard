const fs = require("fs");
const glob = require("glob");
const { detectSecrets } = require("./detectors/detect");

module.exports.scanRepo = () => {
  const files = glob.sync("**/*.{js,ts,json,env}");
  let found = [];

  files.forEach(f => {
    const content = fs.readFileSync(f, "utf8");
    const hits = detectSecrets(content);
    if (hits.length) found.push({ file: f, hits });
  });

  return found;
};
