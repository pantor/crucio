var webpack = require('webpack');

module.exports = {
  entry: './app/crucio.ts',
  output: {
    filename: 'public/js/crucio.js',
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: false
    })
  ]
};
