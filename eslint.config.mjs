// eslint.config.js
import js from "@eslint/js"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import importPlugin from "eslint-plugin-import"
import nodePlugin from "eslint-plugin-node"
import prettierPlugin from "eslint-plugin-prettier"
import globals from "globals"

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
      node: nodePlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,

      // Prettier integration
      "prettier/prettier": "error",

      // Common Node.js / TypeScript adjustments
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "no-underscore-dangle": "off",
      "class-methods-use-this": "off",
      "node/no-unsupported-features/es-syntax": "off",

      // Import handling
      "import/extensions": [
        "error",
        "ignorePackages",
        { ts: "never", js: "never" },
      ],
      "import/no-unresolved": "error",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },
]
