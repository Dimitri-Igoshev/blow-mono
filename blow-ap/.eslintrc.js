module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // 👈 отключает конфликтующие правила
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'warn', // ❗ форматирование — только предупреждение
    'react/react-in-jsx-scope': 'off', // Vite + React 17+
  },
  settings: {
    react: { version: 'detect' },
  },
};
