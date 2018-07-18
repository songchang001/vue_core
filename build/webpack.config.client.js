const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const Extractplugin = require('extract-text-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const merge = require('webpack-merge')

// 是否是测试环境
const isDev = process.env.NODE_ENV === 'development'

let config

const devServer = {
  port: 8008,
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
      NODE_ENV: isDev ? '"developent"' : '"production"'
    }
  }),
  // 自动生成html文件
  new HTMLPlugin()
]

/**
 * 判断是否是开发环境
 *      在config中设置不同的参数
 * */
// 如果是开发环境
if (isDev) {
  config = merge(baseConfig, {
    devtool: '#cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.styl$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                module: true,
                localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]'
              }
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
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(), // 启用 模块热替换插件
      new webpack.NoEmitOnErrorsPlugin() // 在编译出现错误时，确保输出资源不会包含错误
    ])
  })

  // 如果不是开发环境 是生产环境
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../client/index.js'),
      // 生成 vendor.js 文件
      vendor: ['vue']
    },
    output: {
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.styl$/,
          // 使用 Extractplugin 将 css 生成单独文件
          use: Extractplugin.extract({
            fallback: 'vue-style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: { sourceMap: true }
              },
              'stylus-loader'
            ]
          })
        }
      ]
    },
    plugins: [
      // 使用 Extractplugin插件 将 css 生成单独文件，根据内容生成 contentHash 哈希值
      new Extractplugin('styles.[contentHash:8].css'),
      // 单独生成 vendor.js ,将固定的框架 分离出来
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),
      //
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
      })
    ]
  })
}
module.exports = config
