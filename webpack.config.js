// es 标准修正
import { createRequire } from 'module'
import { type } from 'os'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 打包 html
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提取 css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') // css 压缩
const webpack = require('webpack')

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 配置文件
const config = {
  // 解析别名，外部引入使用
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 打包入口
  entry: {
    main: path.resolve(__dirname, './src/js/main.js'), // 样式
    check: path.resolve(__dirname, './src/js/check.js'), // 数据查看
    visualization: path.resolve(__dirname, './src/js/visualization.js'), // 数据可视化
    analysis: path.resolve(__dirname, './src/js/analysis.js') // 可视分析
  },
  // 打包出口
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包出口目录
    filename: './[name].js', // 打包出口文件
    chunkFilename: './dataset/[name].js', // 动态导入生成的文件名称
    clean: true // 生成打包内容前，清空出口目录
  },
  // 插件属性
  plugins: [
    new HtmlWebpackPlugin({
      useCdn: process.env.NODE_ENV === 'production', // CDN 优化
      template: path.resolve(__dirname, 'src/html/main.html'), // 模板文件
      filename: path.resolve(__dirname, 'dist/index.html') // 输出文件
    }),
    new MiniCssExtractPlugin({
      filename: './main.css'// 必须使用相对路径，以 dist 目录相对
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) // 转换
    })
  ],
  // 加载器属性
  module: {
    rules: [
      // 打包 css
      {
        test: /\.css$/i, // 匹配以 css 结尾的文件，不区分大小写
        // use: ['style-loader', 'css-loader']
        // mini-css-extract-plugin 插件与 style-loader 加载器不兼容使用
        use: [process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'] // 逆序加载
      },
      // 打包 less
      {
        test: /\.less$/i, // 匹配以 less 结尾的文件，不区分大小写
        use: [process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      // 打包 csv
      {
        test: /\.csv$/i, // 匹配以 csv 结尾的文件，不区分大小写
        use: ['csv-loader']
      },
      // 打包资源
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        },
        generator: {
          filename: 'images/[name][ext]'
        }
      }
    ]
  },
  // 压缩 css
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      '...' // 保留 JavaScript 压缩
    ],
    splitChunks: {
      chunks: 'async', // 动态导入分割
    }
  }
}

// 调错属性
if (process.env.NODE_ENV === 'development') { // 仅适用开发环境
  config.devtool = 'inline-source-map'
}

// CDN 优化
// if (process.env.NODE_ENV === 'production') { // 生产模式使用
//   config.externals = {
//     key: 'value'
//   }
// }

export default config