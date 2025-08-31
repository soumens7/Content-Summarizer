const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "node", // default to Node
  setupFiles: ["<rootDir>/_tests_/setupEnv.js"],
  // optional: ignore E2E or build outputs
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^axios$": "<rootDir>/_tests_/_mocks_/axios.js",
  },
};

module.exports = createJestConfig(customJestConfig);
