'use strict'

var path = require('path')
var webpack = require('webpack')
var ExtractPlugin = require('extract-text-webpack-plugin')
var HtmlPlugin = require('html-webpack-plugin')
var config = {
  devtool: '#cheap-eval-source-map',

  entry: process.env.NODE_ENV === 'development' ? [
    'webpack-hot-middleware/client?http://localhost:3000',
    path.join(__dirname, 'index')
  ] : path.join(__dirname, 'index'),

  output: {
    path: process.env.NODE_ENV === 'development' ? __dirname : 'deploy',
    publicPath: process.env.NODE_ENV === 'development' ? '/static/' : '',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['', '.js', '.less'],
    alias: {
      'react-rangeslider$': path.join(__dirname, '..', 'src')
    }
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },

  plugins: []
}

// Dev config
if (process.env.NODE_ENV === 'development') {
  config.module.loaders.push({
    test: /\.less$/,
    exclude: /node_modules/,
    loader: 'style!css!less'
  })
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  )
}

// Build config
if (process.env.NODE_ENV === 'production') {
  config.module.loaders.push([
    {
      test: /\.less$/,
      exclude: /node_modules/,
      loader: ExtractPlugin.extract('style-loader', 'css-loader!less-loader')
    }
  ])
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractPlugin('bundle.css'),
    new HtmlPlugin({
      appMountId: 'mount',
      title: 'React RangeSlider',
      template: 'example/index.ejs'
    })
  )
}

module.exports = config
