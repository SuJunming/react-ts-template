const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const devConfig = {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/, // 正则匹配文件路径
        exclude: /node_modules/,
        use: [
          // 注意loader生效是从下往上的
          'style-loader',
          {
            loader: 'css-loader', // 解析 @import 和 url() 为 import/require() 方式处理
            options: {
              importLoaders: 1, // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            },
          },
        ],
      },
      // scss
      {
        test: /\.scss$/,
        include: path.join(__dirname, '../src'), // 只让loader解析我们src底下自己写的文件
        use: [
          'style-loader',
          {
            loader: 'css-loader', // 解析 @import 和 url() 为 import/require() 方式处理
            options: {
              importLoaders: 1, // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            },
          },
          'postcss-loader', // 加了这一行
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      inject: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    overlay: {
      //当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
      errors: true,
    },
    inline: true,
    hot: true,
    proxy: {
      '/api': {
        target: 'www.baidu.com/api',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  },
}

module.exports = merge(baseConfig, devConfig)
