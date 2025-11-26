const chalk = require("chalk");

module.exports = {
  printError: msg => console.log(chalk.red(msg)),
  printInfo: msg => console.log(chalk.cyan(msg))
};
