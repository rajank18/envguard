const regexList = require("./regexList");

function detectSecrets(content) {
  let results = [];

  regexList.forEach(item => {
    const matches = content.match(item.regex);
    if (matches) {
      matches.forEach(m => {
        results.push(`${item.name}: ${m.slice(0, 20)}...`);
      });
    }
  });

  return results;
}

module.exports = { detectSecrets };
