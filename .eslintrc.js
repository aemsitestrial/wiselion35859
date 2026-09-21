module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
  },
  rules: {
    'xwalk/max-cells': ['error', {
      'highlight-card': 9,
      'highlighted-card': 9,
      '*': 4,
    }],
  },
};
