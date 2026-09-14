export default {
  testEnvironment: 'jsdom',
  testTimeout: 30000,
  maxWorkers: '50%',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@locus/.*\\.svg\\?react$': '<rootDir>/__mocks__/svgReactMock.jsx',
    '^@locus/assets/.*\\.(svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/__mocks__/fileMock.js',
    '^@locus/(.*)$': '<rootDir>/modules/locus/$1',
    '^react-image-crop$': '<rootDir>/src/test/mocks/react-image-crop.tsx',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|jpg|png|gif)(\\?.*)?$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/__tests__/",
    "<rootDir>/src/routes/",
    "<rootDir>/src/utils/",
    "<rootDir>/src/pages/NotFound/",
    "<rootDir>/src/pages/Dashboard/",
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!antd|@ant-design|rc-.*|@babel/runtime)',
  ],
};

