const path = require('path');

module.exports = {
  // ...
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'pages'),
      'club': path.resolve(__dirname, 'src'),
    },
  },
};