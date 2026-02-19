import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import {defineConfig, globalIgnores} from 'eslint/config'
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "curly": "error",
      "@stylistic/function-call-argument-newline": ["error", "consistent"],
      "@stylistic/max-len": ["error", { code: 80 }],
      "@stylistic/function-paren-newline": ["error", "multiline-arguments"],
    }
  },
])
