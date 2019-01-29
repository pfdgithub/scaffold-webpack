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
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-decorators",
      "@babel/plugin-proposal-export-default-from",
      "@babel/plugin-proposal-export-namespace-from",
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-proposal-optional-catch-binding",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-private-methods",
      "@babel/plugin-proposal-throw-expressions",
      "@babel/plugin-syntax-dynamic-import"
    ]
  };
};
