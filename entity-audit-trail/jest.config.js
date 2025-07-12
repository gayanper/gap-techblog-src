module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  setupFiles: ["<rootDir>/dist/setup-test.js"],
};
