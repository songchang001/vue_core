// vue-loader options

module.exports = (isDev) => {
  return {
    preserveWhitepace: true, // 去除行尾的空格
    extractCSS: !isDev, // 用extractCSS插件单独打包.vue文件中的css  但是推荐使用vue异步加载模块
    cssModules: {
      localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
      camelCase: true // 将css中 a-b 的命名方式转换为aB的方式
    },
    loaders: {

    }
  }
}
