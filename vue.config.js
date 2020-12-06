const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
module.exports = {
  // 全局样式
  assetsDir: "assets",
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: IS_PROD,
    loaderOptions: {
      sass: {
        prependData: `@import "@/common/scss/global.scss";`
      }
    }
  },
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
  },
  devServer: {
    overlay: {
      // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    host: "localhost",
    port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    hotOnly: true // 热更新
    // proxy: 'http://localhost:8080'   // 配置跨域处理,只有一个代理
  }
};
