import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config} */
const tsSafeqlPluginConfig = {
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

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  tsSafeqlPluginConfig,
];
