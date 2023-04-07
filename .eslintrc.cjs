/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier',
    './.eslintrc-auto-import.json',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  globals: {
    ElMessage: 'readonly',
    ElNotification: 'readonly',
  },
  rules: {
    'vue/script-setup-uses-vars': 'error',
    'no-unused-vars': 'off',
    'vue/require-default-prop': 'off', // prop default
  },
};
