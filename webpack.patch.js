
// This is a patch for webpack.config.js in create-react-app
// It's used to fix issues with validateOptions
const validateOptions = (schema, options) => {
  return options; // Just pass through options without validation
};

module.exports = { validateOptions };
