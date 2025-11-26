#!/usr/bin/env node
const { execSync } = require('child_process');
const { detectSecrets } = require('../src/detectors/detect');
const { printError } = require('../src/utils/printer');
const fs = require('fs');

console.log("[envguard] Checking staged files...");

const files = execSync("git diff --cached --name-only")
  .toString()
  .trim()
  .split("\n")
  .filter(Boolean)
  .filter(file => {
    // Exclude files that commonly have false positives
    return !file.includes('package-lock.json') &&
           !file.includes('node_modules') &&
           !file.includes('src/detectors/');
  });

let hasLeak = false;

for (const file of files) {
  if (!fs.existsSync(file)) continue;

  const content = fs.readFileSync(file, "utf8");
  const findings = detectSecrets(content);

  if (findings.length > 0) {
    hasLeak = true;
    printError(`❌ Secret detected in ${file}`);
    findings.forEach(f => printError(` → ${f}`));
  }
}

if (hasLeak) {
  printError("\nCommit aborted due to secret leaks.");
  process.exit(1);
}

console.log("[envguard] ✔ No secrets found. Safe to commit.");
