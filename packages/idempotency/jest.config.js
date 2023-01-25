module.exports = {
  displayName: {
    name: 'AWS Lambda Powertools utility: IDEMPOTENCY',
    color: 'yellow',
  },
  'runner': 'groups',
  'preset': 'ts-jest',
  'transform': {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleFileExtensions: [ 'js', 'ts' ],
  'collectCoverageFrom': [
    '**/src/**/*.ts',
    '!**/node_modules/**',
  ],
  'testMatch': ['**/?(*.)+(spec|test).ts'],
  'roots': [
    '<rootDir>/src',
    '<rootDir>/tests',
  ],
  'testPathIgnorePatterns': [
    '/node_modules/',
  ],
  'testEnvironment': 'node',
  'coveragePathIgnorePatterns': [
    '/node_modules/',
    '/types/',
    'src/makeFunctionIdempotent.ts', // TODO: remove this once makeFunctionIdempotent is implemented
  ],
  'coverageThreshold': {
    'global': {
      'statements': 100,
      'branches': 100,
      'functions': 100,
      'lines': 100,
    },
  },
  'coverageReporters': [
    'json-summary',
    'text',
    'lcov'
  ]
};