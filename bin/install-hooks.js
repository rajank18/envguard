#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const hooksDir = path.join(process.cwd(), '.git', 'hooks');
const hookFile = path.join(hooksDir, 'pre-commit');

if (!fs.existsSync(hooksDir)) process.exit(0);

const checkStagedPath = path.join(__dirname, 'check-staged.js').replace(/\\/g, '/');
const hookContent = `#!/bin/sh
node "${checkStagedPath}"
`;

fs.writeFileSync(hookFile, hookContent, { mode: 0o755 });
console.log("[envguard] Pre-commit hook installed.");
