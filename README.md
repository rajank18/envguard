# env-safe-guard 🔐  
Protect your repository from accidental secret leaks.

## Features
- 🛡️ Pre-commit hook to block leaked secrets
- 🔍 Detects AWS, Stripe, JWT, Mongo, Postgres, API keys
- 📊 Repo scanner CLI
- 🧹 Console.log secret scrubber
- ⚡ Runs 100% offline
- 🤖 Auto-prompt to add .env to .gitignore

## Installation

### For Project Protection (Recommended)
Install locally in your project to enable pre-commit hooks:

```bash
npm install env-safe-gaurd
```

The postinstall script automatically sets up git hooks to protect your commits.

### For Global CLI Usage
Install globally to use `env-scan` command anywhere:

```bash
npm install -g env-safe-gaurd
```

## Usage

### Scan Repository

**With local install:**
```bash
npx env-scan
```

**With global install:**
```bash
env-scan
```

If `.env` files with secrets are detected and not in `.gitignore`, you'll be prompted to add them automatically.

### Pre-commit Hook

The pre-commit hook runs automatically when you commit. It will block commits containing secrets:

```bash
git commit -m "your message"
# envguard will scan staged files and block if secrets are found
```

### Programmatic Usage

#### Scrub Console Logs

```javascript
require('env-safe-gaurd');
// Console logs with secrets will be automatically scrubbed
console.log('API Key:', 'sk_live_1234567890abcdef');
// Output: API Key: sk_live_***[REDACTED]***
```

#### Scan Files

```javascript
const { scanRepo } = require('env-safe-gaurd');
const results = scanRepo();
```

## Detected Secret Types

- AWS Access Keys (AKIA...)
- AWS Secret Keys
- Stripe Live/Test Keys
- JWT Tokens
- MongoDB URIs
- PostgreSQL URIs
- Private Keys (PEM format)
- Generic API Keys (16+ alphanumeric characters)

## Configuration

The tool works out of the box with sensible defaults. Customize detection patterns in `src/detectors/regexList.js` if needed.

## How It Works

1. **Pre-commit Hook**: Scans staged files before commit
2. **Repository Scanner**: Scans all files matching `**/*.{js,ts,json,env}` and `.env*` files
3. **Secret Scrubber**: Intercepts console.log calls and redacts detected secrets
4. **Smart Filtering**: Excludes `node_modules`, `package-lock.json`, and detector files

## Quick Start

```bash
# Install in your project
npm install env-safe-gaurd

# Scan for secrets
npx env-scan

# Try to commit (hook will protect you)
git commit -m "test"
```

## License

MIT

