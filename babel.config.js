module.exports = (api) => {
  // Cache the returned value forever and don't call this function again.
  api.cache(true);

  return {
    "presets": [
      [
        "@babel/preset-env",
        {
          "modules": false,
          "useBuiltIns": "usage"
        }
      ],
      "@babel/preset-react"
    ],
    "plugins": [
      "react-hot-loader/babel",
      [
        "babel-plugin-imports",
        {
          "ruleExtend": "imports.config.js"
        }
      ],
      [
        "@babel/plugin-transform-runtime",
        {
          "corejs": 2,
          "useESModules": true
        }
      ],
      // Stage 0
      // "@babel/plugin-proposal-function-bind",
      // Stage 1
      // "@babel/plugin-proposal-do-expressions",
      "@babel/plugin-proposal-export-default-from",
      // "@babel/plugin-proposal-logical-assignment-operators",
      // "@babel/plugin-proposal-nullish-coalescing-operator",
      // "@babel/plugin-proposal-optional-chaining",
      // "@babel/plugin-proposal-pipeline-operator",
      // Stage 2
      // "@babel/plugin-proposal-decorators",
      "@babel/plugin-proposal-export-namespace-from",
      // "@babel/plugin-proposal-function-sent",
      // "@babel/plugin-proposal-numeric-separator",
      "@babel/plugin-proposal-throw-expressions",
      // Stage 3
      "@babel/plugin-proposal-class-properties",
      // "@babel/plugin-proposal-json-strings",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-syntax-import-meta"
    ]
  };
};
