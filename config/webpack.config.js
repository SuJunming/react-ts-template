const path = require('path')
const webpack = require('webpack')
const env = require('./env.json')
const resolve = function (dir) {
  return path.join(__dirname, dir)
}
const ENV = process.env.NODE_ENV === 'dev' ? env.dev : env.prod
console.log(ENV)
module.exports = {
  entry: resolve('../src/index.tsx'),
  output: {
    filename: `js/[name].[${
      process.env.NODE_ENV === 'prod' ? 'chunkHash' : 'hash'
    }].js`,
    path: resolve('../dist'),
  },
  module: {
    rules: [
      //js tsx
      {
        test: /\.(j|t)sx?$/,
        include: [resolve('../src')],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        // 排除node_modules底下的
        exclude: /node_modules/,
      },
      // css
      //图片
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              //1024 == 1kb
              //小于10kb时打包成base64编码的图片否则单独打包成图片
              limit: 10240,
              name: path.join('img/[name].[hash:7].[ext]'),
            },
          },
        ],
      },
      //字体
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              name: path.join('font/[name].[hash:7].[ext]'),
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@src': path.resolve('./src'),
      '@api': path.resolve('./src/api'),
      '@components': resolve('../src/components'),
      '@ct': resolve('../src/utils/Connect.tsx'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.ENV_INFO': JSON.stringify(ENV),
    }),
  ],
}
