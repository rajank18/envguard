#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const hooksDir = path.join(process.cwd(), '.git', 'hooks');
const hookFile = path.join(hooksDir, 'pre-commit');

if (!fs.existsSync(hooksDir)) process.exit(0);

const hookContent = `#!/bin/sh
npx envguard-check
`;

fs.writeFileSync(hookFile, hookContent, { mode: 0o755 });
console.log("[envguard] Pre-commit hook installed.");
