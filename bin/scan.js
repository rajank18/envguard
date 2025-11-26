#!/usr/bin/env node
const glob = require("glob");
const fs = require("fs");
const readline = require("readline");
const { detectSecrets } = require("../src/detectors/detect");
const { printError, printInfo } = require("../src/utils/printer");

printInfo("[envguard] Scanning repository...");

const files = glob.sync("**/*.{js,ts,json,env}", {
  ignore: [
    "node_modules/**",
    "package-lock.json",
    "**/package-lock.json",
    "src/detectors/**",
    ".git/**"
  ],
  dot: true
});

// Also scan .env files (they don't have extensions)
const envFiles = glob.sync("**/.env*", {
  ignore: [
    "node_modules/**",
    ".git/**"
  ],
  dot: true
});

// Merge and remove duplicates
const allFiles = [...new Set([...files, ...envFiles])];

let totalFindings = 0;
const exposedEnvFiles = [];

allFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, "utf8");
  const result = detectSecrets(content);

  if (result.length > 0) {
    totalFindings += result.length;
    printError(`\n⚠ Leaks in ${file}`);
    result.forEach(r => printError(` → ${r}`));
    
    // Track .env files that have secrets
    if (file.endsWith(".env") || file.includes(".env.")) {
      exposedEnvFiles.push(file);
    }
  }
});

if (totalFindings === 0) {
  printInfo("\n✔ No leaks found!");
} else {
  printError(`\nTotal secrets detected: ${totalFindings}`);
  
  // Check if .env files are in .gitignore
  if (exposedEnvFiles.length > 0) {
    checkAndPromptGitignore(exposedEnvFiles);
  }
}

function checkAndPromptGitignore(envFiles) {
  const gitignorePath = ".gitignore";
  let gitignoreContent = "";
  
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
  }
  
  const unprotectedFiles = [...new Set(envFiles)].filter(file => {
    const fileName = file.split(/[/\\]/).pop();
    return !gitignoreContent.includes(".env");
  });
  
  if (unprotectedFiles.length > 0) {
    printError("\n⚠️  WARNING: .env files with secrets are NOT in .gitignore!");
    unprotectedFiles.forEach(file => printError(`   - ${file}`));
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question("\nDo you want to add .env files to .gitignore? (y/n): ", (answer) => {
      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        addToGitignore(gitignorePath, gitignoreContent);
        printInfo("✔ .env files added to .gitignore");
      } else {
        printInfo("Skipped adding to .gitignore");
      }
      rl.close();
    });
  }
}

function addToGitignore(gitignorePath, existingContent) {
  const entriesToAdd = [
    ".env",
    ".env.*",
    "!.env.example"
  ];
  
  let newContent = existingContent.trim();
  if (newContent && !newContent.endsWith("\n")) {
    newContent += "\n";
  }
  
  entriesToAdd.forEach(entry => {
    if (!existingContent.includes(entry)) {
      newContent += `${entry}\n`;
    }
  });
  
  fs.writeFileSync(gitignorePath, newContent, "utf8");
}
