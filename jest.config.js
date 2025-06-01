// jest.config.js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  roots: ['<rootDir>/__tests__', '<rootDir>/utils'],
  moduleNameMapper: {
    // CSS module import 시 오류 방지
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
