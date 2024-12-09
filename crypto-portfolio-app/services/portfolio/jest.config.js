module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$', // Ensure this matches your test files
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testMatch: ['**/test/**/*.spec.ts'], // Add this if tests are in the `test` directory
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};
