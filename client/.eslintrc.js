module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-no-undef": "off",
    "react/no-unescaped-entities": "off",
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/jsx-no-target-blank": "off",
    "no-unused-vars": "off",
    "no-console": "off",
    "no-undef": "off",
    "no-case-declarations": "off",
    "no-useless-escape": "off",
    "no-unreachable": "off",
    "no-constant-condition": "off",
  },
}
