const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

// 打包时添加抽离css插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩抽离出来的css文件
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// 压缩js
const TerserPlugin = require('terser-webpack-plugin')
module.exports = merge(baseConfig, {
  mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  plugins: [
    // 打包时静态文件直接复制
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),// 复制public下文件
          to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
          filter: source => {
            return !source.includes('index.html')// 忽略index.html
          }
        }
      ]
    }),
    new MiniCssExtractPlugin({
      // 抽离css的输出目录和名称
      // 在开发模式css会嵌入到style标签里面,方便样式热替换,打包时会把css抽离成单独的css文件。
      filename: 'static/css/[name].[contenthash:8].css'
    })
  ],
  // 优化项
  optimization: {
    minimizer: [
      // 压缩css文件
      new CssMinimizerPlugin(),
      // 压缩 js
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"] // 删除 console.log
          }
        }
      })
    ],
    // 代码分割第三方包和公共模块
    splitChunks: {
      // 单独把node_modules中的代码单独打包, 当第三包代码没变化时,对应chunkhash值也不会变化,可以有效利用浏览器缓存
      cacheGroups: {
        // 提取node_modules代码
        vendors: {
          test: /node_modules/,
          // 提取文件命名为vendors,js后缀和chunkhash会自动加
          name: 'vendors',
          // 只要使用一次就提取出来
          minChunks: 1,
          // 只提取初始化就能获取到的模块,不管异步的
          chunks: 'initial',
          // 提取代码体积大于0就提取出来
          minSize: 0, 
          priority: 1  // 提取优先级为1
        },
        commons: {
          // 提取页面公共代码
          name: 'commons', // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
        }
      }
    }
  }
})