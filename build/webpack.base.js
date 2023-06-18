const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// 把css单独抽离出来,方便配置缓存策略
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDEV = process.env.NODE_ENV === 'development'

module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'),
  output: {
    // 加上[chunkhash:8],chunkhash
    filename: 'static/js/[name].[chunkhash:8].js', // 每个输出js名称
    path: path.join(__dirname, '../dist'),
    clean: true,
    publicPath: '/' // 打包后文件的公共前缀路径
  },
  cache: {
    // 使用文件缓存
    type: 'filesystem'
  },
  module: {
    rules: [
      // 合理配置loader的作用范围,来减少不必要的loader解析
      {
        // 只对项目src文件的ts,tsx进行loader解析
        include: [path.resolve(__dirname, '../src')],
        test: /.(ts|tsx)$/, // 匹配ts tsx 文件
        // 开启多线程也是需要启动时间,大约600ms左右,所以适合规模比较大的项目。
        use: ['thread-loader', 'babel-loader'],
      },
      {
        //loader执行顺序是从右往左,
        //从下往上的,匹配到css文件后先用css-loader解析css, 
        //最后借助style-loader把css插入到头部style标签中。
        test: /\.css$/,
        include: [path.resolve(__dirname, '../src')],
        use: [
          // 开发环境使用style-looader,打包模式抽离css
          isDEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, '../src')],
        use: [
          // 开发环境使用style-looader,打包模式抽离css
          isDEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64
          }
        },
        generator: {
          filename: 'static/images/[name].[contenthash:8][ext]', // 文件输出目录和名称
        }
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]', // 文件输出目录和名称
        }
      },
      {
        test: /.(mp4|webm|logg|mp3|wav|flac|aac)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          filename: 'static/media/[name].[contenthash:8][ext]', // 文件输出目录和名称
        }
      },

    ]
  },
  // 解析模块，匹配后缀
  resolve: {
    // 这里只配置js, tsx和ts，其他文件引入都要求带后缀，可以提升构建速度。
    extensions: ['.js', '.tsx', '.ts'],
    // 设置别名alias,设置别名可以让后续引用的地方减少路径的复杂度
    alias: {
      '@': path.join(__dirname, '../src')
    },
    // 如果用的是pnpm 就暂时不要配置这个，会有幽灵依赖的问题，访问不到很多模块。
    // 查找第三方模块只在本项目的node_modules中查找
    modules: [path.resolve(__dirname, '../node_modules')]
  },
  plugins: [
    // webpack需要把最终构建好的静态资源都引入到一个html文件中,这样才能在浏览器中运行,html-webpack-plugin就是来做这件事情的
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
    // 配置后会把值注入到业务代码里面去
    new webpack.DefinePlugin({
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
    }),
  ]
}