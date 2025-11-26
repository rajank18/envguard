const fs = require("fs");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

module.exports = { read };
