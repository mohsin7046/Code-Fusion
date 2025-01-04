module.exports = {
  env: {
    node: true, // Enables Node.js global variables
    es2021: true, // Enables ES2021 syntax
  },
  extends: [
    'eslint:recommended', // Use recommended ESLint rules
    'plugin:prettier/recommended', // Integrates Prettier with ESLint
  ],
  plugins: ['prettier'], // Enables Prettier as a plugin
  rules: {
    'prettier/prettier': 'error', // Treat Prettier issues as ESLint errors
    'no-unused-vars': 'warn', // Warn about unused variables
    'no-console': 'off', // Allow console.log for debugging
  },
  parserOptions: {
    ecmaVersion: 2020, // Use modern JavaScript syntax
    sourceType: 'module', // Enable ECMAScript modules (ESM)
  },
};
