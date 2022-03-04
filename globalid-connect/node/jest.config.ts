import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    'src/{**/*.module.ts,main.ts,config.schema.ts}': {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true
};

export default config;
