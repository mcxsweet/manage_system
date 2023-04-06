const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, //关闭语法检查

  devServer: {
    //路由跨域问题
    // proxy: "http://43.140.201.70:8080"
    proxy: "http://localhost:8080"
  }
})
