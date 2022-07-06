module.exports = function () {
  return {
    filesWithNoCoverageCalculated: [
      'src/**/*-dto.ts',
      'src/**/*.factory.ts',
      'src/**/*.module.ts',
      'src/**/*.provider.ts',
      'src/**/*.schema.ts',
      'src/interfaces.ts',
      'src/main.ts',
      'src/types.ts',
      'test/**/*',
      'public/**/*',
      'jest.config.ts',
      'wallaby.conf.js'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: {
      configFile: './jest.config.ts'
    }
  };
};
