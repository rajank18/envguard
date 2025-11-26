#!/usr/bin/env node
const glob = require("glob");
const fs = require("fs");
const { detectSecrets } = require("../src/detectors/detect");
const { printError, printInfo } = require("../src/utils/printer");

printInfo("[envguard] Scanning repository...");

const files = glob.sync("**/*.{js,ts,json,env}");

let totalFindings = 0;

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, "utf8");
  const result = detectSecrets(content);

  if (result.length > 0) {
    totalFindings += result.length;
    printError(`\n⚠ Leaks in ${file}`);
    result.forEach(r => printError(` → ${r}`));
  }
});

if (totalFindings === 0) {
  printInfo("\n✔ No leaks found!");
} else {
  printError(`\nTotal secrets detected: ${totalFindings}`);
}
