const path = require('path');

module.exports = {
  // Your existing Webpack configuration
  // ...

  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
};