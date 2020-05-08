const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const resolve = function (dir) {
  return path.join(__dirname, dir)
}
const prodConfig = {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/, // 正则匹配文件路径
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          // 注意loader生效是从下往上的
          {
            loader: 'css-loader', // 解析 @import 和 url() 为 import/require() 方式处理
            options: {
              importLoaders: 1, // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            },
          },
          'postcss-loader',
        ],
      },
      // scss
      {
        test: /\.scss$/,
        include: path.join(__dirname, '../src'), // 只让loader解析我们src底下自己写的文件
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader', // 解析 @import 和 url() 为 import/require() 方式处理
            options: {
              importLoaders: 1, // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  // 性能配置
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      chunks: 'async', // 提取的 chunk 类型，all: 所有，async: 异步，initial: 初始
      // minSize: 30000, // 默认值，新 chunk 产生的最小限制 整数类型（以字节为单位）
      // maxSize: 0, // 默认值，新 chunk 产生的最大限制，0为无限 整数类型（以字节为单位）
      // minChunks: 1, // 默认值，新 chunk 被引用的最少次数
      // maxAsyncRequests: 5, // 默认值，按需加载的 chunk，最大数量
      // maxInitialRequests: 3, // 默认值，初始加载的 chunk，最大数量
      // name: true, // 默认值，控制 chunk 的命名
      cacheGroups: {
        // 配置缓存组
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: 10, // 优先级
          reuseExistingChunk: false, // 允许复用已经存在的代码块
          test: /node_modules\/(.*)\.js/, // 只打包初始时依赖的第三方
        },
        common: {
          name: 'common',
          chunks: 'initial',
          // test: resolve("src/components"), // 可自定义拓展你的规则
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'), // 使用 cssnano 压缩器
        cssProcessorOptions: {
          reduceIdents: false,
          autoprefixer: false,
          safe: true,
          discardComments: {
            removeAll: true,
          },
        },
      }),
      new TerserPlugin({
        cache: true,
        // parallel: true,
        terserOptions: {
          compress: {
            warnings: true,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'], // 移除console
          },
        },
        sourceMap: true,
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      inject: true,
      minify: {
        removeComments: true, // 去掉注释
        collapseWhitespace: true, // 去掉多余空白
        removeAttributeQuotes: true, // 去掉一些属性的引号，例如id="moo" => id=moo
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CleanWebpackPlugin(),
    new ScriptExtHtmlWebpackPlugin({
      //`runtime` must same as runtimeChunk name. default is `runtime`
      inline: /runtime\..*\.js$/,
    }),
    new webpack.DllReferencePlugin({
      manifest: path.join(__dirname, `../dll/vendor.manifest.json`),
    }),
    new AddAssetHtmlPlugin({
      filepath: resolve(`../dll/*.js`),
      includeSourcemap: false,
    }),
    new BundleAnalyzerPlugin(),
  ],
}
module.exports = merge(baseConfig, prodConfig)
