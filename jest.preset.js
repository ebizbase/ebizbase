const nxPreset = require('@nx/jest/preset').default;
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.base.json');

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  ...nxPreset,
  verbose: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['text'],
  coveragePathIgnorePatterns: ['/node_modules/', 'index.js', 'index.ts'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      statements: 70,
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '',
    useESM: true,
  }),
};
