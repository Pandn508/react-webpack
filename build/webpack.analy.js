const prodConfig = require('./webpack.prod.js')
// 引入webpack打包速度分析插件
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// 实例化分析插件
const smp = new SpeedMeasurePlugin();

const { merge } = require('webpack-merge') 

// webpack包分析工具
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

// 使用smp.wrap方法,把生产环境配置传进去,由于后面可能会加分析配置,所以先留出合并空位
module.exports = smp.wrap(merge(prodConfig, {
  plugins: [
    // 配置分析打包结果插件
    new BundleAnalyzerPlugin()
  ]
}))
