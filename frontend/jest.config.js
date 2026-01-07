/**
 * jest.config.js (CommonJS)
 *
 * Why .js instead of .ts?
 * - Jest loads this file with plain Node at startup.
 * - Keeping it .js avoids needing ts-node / ts-jest / ESM config complexity.
 * - Your app can still be 100% TS/TSX; tooling configs can remain JS safely.
 */

/** @type {import('jest').Config} */
module.exports = {
  // ===========================================================================
  // Core runtime
  // ===========================================================================
  testEnvironment: 'jsdom',

  // ===========================================================================
  // Transforms (TS/TSX + JS/JSX via Babel)
  // - This is what makes Jest understand `import` syntax and TS/TSX.
  // ===========================================================================
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },

  // Let Jest resolve these extensions without specifying them in imports.
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // ===========================================================================
  // Node_modules ESM exceptions
  // - By default, Jest does NOT transform node_modules.
  // - Some packages ship ESM and must be transformed.
  // ===========================================================================
  transformIgnorePatterns: ['/node_modules/(?!(nanoid|uuid|lodash-es)/)'],

  // ===========================================================================
  // Test discovery hygiene
  // ===========================================================================
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/_dupe_hold/',
  ],

  // ===========================================================================
  // Setup hooks
  //
  // IMPORTANT: Your log shows:
  //  - "toBeInTheDocument is not a function"  => missing @testing-library/jest-dom
  //  - "URL.createObjectURL is not a function" => missing jsdom polyfill
  //
  // Create this file if it doesn't exist:
  //   src/tests/jest.setup.ts
  //
  // It should:
  //   import '@testing-library/jest-dom';
  //   if (!global.URL.createObjectURL) global.URL.createObjectURL = jest.fn();
  // ===========================================================================
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],

  // ===========================================================================
  // Module resolution / aliases / mocks
  // ===========================================================================
  moduleNameMapper: {
    // -------------------------------------------------------------------------
    // Primary alias (matches your Vite/TS convention: "@/...")
    // -------------------------------------------------------------------------
    '^@/(.*)$': '<rootDir>/src/$1',

    // -------------------------------------------------------------------------
    // Common “folder aliases”
    // (You have tests importing @components/... so we map it explicitly)
    // -------------------------------------------------------------------------
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@hauler/(.*)$': '<rootDir>/src/components/hauler/$1',
    '^@archive/(.*)$': '<rootDir>/src/_archive/$1',
    '^@i18n$': '<rootDir>/src/i18n',

    // -------------------------------------------------------------------------
    // Vite-only modules / import.meta stubs
    // If any tests import your logger (which uses import.meta),
    // force them to a safe mock so Jest never parses the Vite-only code.
    // -------------------------------------------------------------------------
    '^@/utils/logger$': '<rootDir>/src/tests/__mocks__/loggerMock.ts',
    '^@utils/logger$': '<rootDir>/src/tests/__mocks__/loggerMock.ts',
    '^src/utils/logger$': '<rootDir>/src/tests/__mocks__/loggerMock.ts',

    // -------------------------------------------------------------------------
    // Styles
    // -------------------------------------------------------------------------
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',

    // -------------------------------------------------------------------------
    // Static assets
    // Keep fileMock.js as JS: simplest + totally fine in a TS repo.
    // -------------------------------------------------------------------------
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$':
      '<rootDir>/src/tests/__mocks__/fileMock.js',

    // -------------------------------------------------------------------------
    // Optional/Heavy deps that you don’t want blocking unit tests
    // (These are currently showing up as "Cannot find module ..." in your logs.)
    // -------------------------------------------------------------------------
    '^puppeteer$': '<rootDir>/src/tests/__mocks__/emptyModule.ts',
    '^recharts$': '<rootDir>/src/tests/__mocks__/emptyModule.ts',
    '^papaparse$': '<rootDir>/src/tests/__mocks__/emptyModule.ts',
    '^react-tooltip$': '<rootDir>/src/tests/__mocks__/emptyModule.ts',
    '^@tensorflow-models/blazeface$': '<rootDir>/src/tests/__mocks__/emptyModule.ts',

    // -------------------------------------------------------------------------
    // Monorepo-ish internal package mapping (only if the file actually exists)
    // If this path is wrong, remove this line.
    // -------------------------------------------------------------------------
    '^@cfh/inspection-utils$': '<rootDir>/packages/inspection-utils/src/index.ts',
  },
};
