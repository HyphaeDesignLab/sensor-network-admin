var path = require('path');
var SRC_DIR = path.join(__dirname, './src');
var DIST_DIR = path.join(__dirname, '../public/');

module.exports = {

  /*
    EDIT: may eventally get rid of all the test files, but might be better to have different build commands to build different tests instead of build all in one command in the long run
  */
  entry: {
    'dashboard':  { import: `${SRC_DIR}/index.jsx`, filename: `dashboard.bundle.js` },
    // 'test-context-yui': { import: `${SRC_DIR}/tests/context-yui/index.jsx`, filename: 'test-context-yui.bundle.js'},
    // 'test-context':  { import: `${SRC_DIR}/tests/context/index.jsx`, filename: `test-context.bundle.js` },
    // 'test-form':  { import: `${SRC_DIR}/tests/form/index.jsx`, filename: `test-form.bundle.js` }
  },
  output: {
    path: DIST_DIR
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        include: SRC_DIR,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
       }
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'url-loader',
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ]
  }
};