import type { Config } from 'jest';

const config: Config = {

  preset: 'ts-jest',

  testEnvironment: 'node',

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

export default config;
