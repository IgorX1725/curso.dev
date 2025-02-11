import js from "@eslint/js";
import jest from "eslint-plugin-jest";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    plugins: { jest, prettier },
  },
];
