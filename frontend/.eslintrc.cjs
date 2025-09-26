/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  env: {
    "vue/setup-compiler-macros": true,
  },
  rules: {
    // Allow single-word component names for pages and layout components
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["Home", "Layout", "NotFound"],
      },
    ],
  },
};
