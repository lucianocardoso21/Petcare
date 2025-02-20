import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import next from "eslint-plugin-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Desativa a necessidade do import React para JSX
      "react/prop-types": "off", // (opcional) Se não quiser lidar com prop-types agora
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.recommended,
  next.configs.recommended, // Para o Next.js
];
