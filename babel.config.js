module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          edge: '17',
          firefox: '60',
          chrome: '60',
          safari: '11.1',
          ie: '10',
        },
        corejs: '3', // 声明corejs版本
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-syntax-dynamic-import',
  ],
}
