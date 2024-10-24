export default {
  displayName: 'localize-service',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../.coverage/microservices/localize-service',
  coveragePathIgnorePatterns: ['/protobuf/'],
};
