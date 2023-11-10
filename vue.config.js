const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, //关闭语法检查

  // publicPath: "",
  publicPath: "/zyrz",

  devServer: {
    //路由跨域问题
    proxy: "http://218.194.100.49:2024"
    // proxy: "http://localhost:8080"
  }
})
