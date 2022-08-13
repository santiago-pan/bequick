module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },

  roots: ['<rootDir>'],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js)$": "babel-jest",
  },
  transformIgnorePatterns: [
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: false,
  clearMocks: true
};

