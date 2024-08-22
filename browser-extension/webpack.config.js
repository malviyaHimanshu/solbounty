const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    background: './src/background.js',
    content: './src/content.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' }, // Copy manifest.json to dist
        // { from: 'src/content.js', to: 'content.js' }, // Copy manifest.json to dist
        // { from: 'src/background.js', to: 'background.js' }, // Copy manifest.json to dist
        // { from: 'src/webextension-polyfill.js', to: 'webextension-polyfill.js' }, // Copy manifest.json to dist
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};