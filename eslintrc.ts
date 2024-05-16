import type { Linter } from "eslint";

const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");

const tsSafeqlPluginConfig: Linter.Config = {
  plugins: ["@ts-safeql/eslint-plugin"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "@ts-safeql/check-sql": [
      "error",
      {
        connections: [
          {
            connectionUrl: process.env.DATABASE_URL,
            migrationsDir: "./prisma/migrations",
            targets: [
              { tag: "prisma.+($queryRaw|$executeRaw)", transform: "{type}[]" },
            ],
          },
        ],
      },
    ],
  },
};

const config: Linter.Config = {
  overrides: [
    { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
    { languageOptions: { globals: globals.browser } },
  ],
  extends: [
    "plugin:@eslint/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ...tsSafeqlPluginConfig,
};

module.exports = config;
