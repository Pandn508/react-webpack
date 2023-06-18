const path = require('path');
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

// 合并公共配置， 添加开发环境配置
module.exports = merge(baseConfig, {
  mode: 'development', // 开发模式，打包更快速，省了代码优化的步骤
  devtool: 'eval-cheap-module-source-map', // 源代码调试模式
  devServer: {
    port: 3000,
    compress: false, // gzip压缩，开发环境不开启，提高热更新速度
    hot: true,
    historyApiFallback: true, // 解决history路由404的问题
    static: {
      directory: path.join(__dirname, '../public') //托管静态资源public文件夹
    }
  },
  // 源码映射，定位问题
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    // 添加热更新插件
    new ReactRefreshWebpackPlugin(),
  ]
})