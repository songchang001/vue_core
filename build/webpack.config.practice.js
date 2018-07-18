const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const baseConfig = require('./webpack.config.base')
const merge = require('webpack-merge')

let config

const devServer = {
  port: 8007,
  host: '127.0.0.1',
  overlay: {
    errors: true
  },
  // 是否启用热加载
  hot: true
  // open:true, //自动打开页面
  // historyFallback:{

  // }
}

const defaultPlugins = [
  // 设置环境变量值 生产环境 or 开发环境
  new webpack.DefinePlugin({
    'progess.env': {
      NODE_ENV: '"developent"'
    }
  }),
  // 自动生成html文件
  new HTMLPlugin({
    template: path.join(__dirname, 'template.html')
  })
]

config = merge(baseConfig, {
  entry: path.join(__dirname, '../practice/index.js'),
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true }
          },
          'stylus-loader'
        ]
      }
    ]
  },
  devServer,
  resolve: {
    alias: { // 使用非 runtime 的vue代码
      'vue': '../node_modules/vue/dist/vue.esm.js'
    }
  },
  plugins: defaultPlugins.concat([
    new webpack.HotModuleReplacementPlugin(), // 启用 模块热替换插件
    new webpack.NoEmitOnErrorsPlugin() // 在编译出现错误时，确保输出资源不会包含错误
  ])
})
module.exports = config
