module.exports = [
  { name: "AWS Access Key", regex: /AKIA[0-9A-Z]{16}/g },
  { name: "AWS Secret Key", regex: /(?<![A-Za-z0-9])[A-Za-z0-9\/+=]{40}(?![A-Za-z0-9])/g },

  { name: "Stripe Live Key", regex: /sk_live_[0-9a-zA-Z]{24}/g },
  { name: "Stripe Test Key", regex: /sk_test_[0-9a-zA-Z]{24}/g },

  { name: "JWT Token", regex: /eyJ[a-zA-Z0-9_-]+?\.[a-zA-Z0-9_-]+?\.[a-zA-Z0-9_-]+/g },

  { name: "Mongo URI", regex: /mongodb(\+srv)?:\/\/[^ "]+/g },
  { name: "Postgres URI", regex: /postgres:\/\/[^ "]+/g },

  { name: "Private Key", regex: /-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/g },

  // Generic API Key - must have mix of upper/lower or numbers, avoid camelCase function names
  { name: "Generic API Key", regex: /(?<![A-Za-z0-9_])(?=.*[A-Z])(?=.*[a-z0-9])[A-Za-z0-9]{24,64}(?![A-Za-z0-9_])|(?<![A-Za-z0-9_])(?=.*[0-9])[A-Za-z0-9]{32,64}(?![A-Za-z0-9_])/g }
];
