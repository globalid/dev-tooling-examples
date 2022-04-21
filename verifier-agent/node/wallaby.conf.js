module.exports = function () {
  return {
    filesWithNoCoverageCalculated: [
      'src/**/*-dto.ts',
      'src/**/*-dto-factory.ts',
      'src/**/*.module.ts',
      'src/**/*.provider.ts',
      'src/**/*.schema.ts',
      'src/interfaces.ts',
      'src/main.ts',
      'src/types.ts',
      'test/**/*',
      'jest.config.ts',
      'wallaby.conf.js',
    ],
    testFramework: {
      configFile: './jest.config.ts'
    }
  };
};
