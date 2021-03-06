import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/.*\\.module.ts$',
    '<rootDir>/.*\\.provider.ts$',
    '<rootDir>/.*\\.schema.ts$',
    '<rootDir>/main.ts$',
    '<rootDir>/setup.ts$'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  verbose: true
};

export default config;
