import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import jestPlugin from "eslint-plugin-jest";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import json from "@eslint/json";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores([
        "**/dist/",
        "**/build/",
        "**/package-lock.json",
        "**/tsconfig.json",
        "**/webpack.*.js",
        "**/.docusaurus/",
    ]),
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-require-imports": "off",
        },
    },
    {
        files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
        ...pluginReact.configs.flat.recommended,
    },
    {
        files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
        languageOptions: {
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
            },
        },
    },
    {
        files: ["**/*.spec.{js,ts,jsx,tsx}", "**/setup-jest.{js,ts}"],
        languageOptions: {
            globals: {
                ...jestPlugin.environments.globals.globals, // Jest globals like `jest`, `describe`, `it`
            },
        },
        plugins: {
            jest: jestPlugin,
        },
    },
    {
        files: ["**/*.json"],
        plugins: { json },
        language: "json/json",
        extends: ["json/recommended"],
        rules: {
            "json/no-empty-keys": "off",
        },
    },
    eslintConfigPrettier,
    {
        settings: {
            react: {
                version: "detect",
            },
        },
    },
]);
