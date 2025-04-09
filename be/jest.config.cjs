const { defaults } = require('jest-config');

module.exports = {

  preset: 'ts-jest',

  testEnvironment: 'node',

  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@prisma/generated$": "<rootDir>/prisma/generated",
    "^@prisma/generated/(.*)$": "<rootDir>/prisma/generated/$1"
  },

  roots: ['<rootDir>/src'],

  testRegex: '.*\\.spec\\.ts$',

  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: "coverage",

  coverageProvider: "v8",

};
