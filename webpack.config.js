const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const GasPlugin = require('gas-webpack-plugin')

const config = {
  mode: process.env.NODE_ENV ?? 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  plugins: [
    new GasPlugin(),
    new CopyPlugin({
      patterns: [{ from: './appsscript.json' }],
    }),
  ],
}

module.exports = config
