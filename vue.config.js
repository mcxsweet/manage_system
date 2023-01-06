const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, //关闭语法检查

  devServer: {
    //路由跨域问题
    proxy: 'http://localhost:8080'
  }
})
