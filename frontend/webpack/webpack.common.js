const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../src/scripts/index.js'),
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        }
      }
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: Path.resolve(__dirname, '../public'), to: 'public' }],
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html'),
    }),
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        type: 'asset'
      },
    ],
  },
};
