// babel-loader的配置

// 为babel-loader配置react-refesh刷新插件
const isDEV = process.env.NODE_ENV === 'development'

module.exports = {
  // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
  presets: [
    [
      '@babel/preset-env',
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        // "targets": {
        //  "chrome": 35,
        //  "ie": 9
        // },
        'useBuiltIns': 'usage',// 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        // 使用低版本js语法模拟高版本的库,也就是垫片
        'corejs': 3,
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    // babel处理js非标准语法 识别装饰器语法
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    // 如果是开发模式,就启动react热更新插件
    isDEV && require.resolve('react-refresh/babel'), 
  ].filter(Boolean)
}