module.exports = {
    testEnvironment: "jest-environment-jsdom",
    moduleFileExtensions: ["js", "jsx"],
    moduleDirectories: ["node_modules", "<rootDir>/"],
    setupFilesAfterEnv: ["@testing-library/jest-dom"], 
  };
  