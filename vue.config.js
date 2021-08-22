/* eslint-disable @typescript-eslint/no-var-requires */
const CompressionPlugin = require("compression-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
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
  },
  configureWebpack: {
    plugins: [
      new HardSourceWebpackPlugin(),
      new CompressionPlugin({
        test: /\.(js|css)(\?.*)?$/i, //需要压缩的文件正则
        threshold: 1024, //文件大小大于这个值时启用压缩
        deleteOriginalAssets: false //删除源文件，不建议
      }),
      new BundleAnalyzerPlugin()
    ],
    externals: {
      // <-添加
      vue: "Vue",
      vuex: "Vuex",
      "vue-router": "VueRouter",
      axios: "axios",
      animejs: "animejs",
      moment: "moment",
      lodash: "_"
    },
    optimization: {
      splitChunks: {
        //分割代码块
        cacheGroups: {
          vendor: {
            //第三方依赖
            priority: 1, //设置优先级，首先抽离第三方模块
            name: "vendor",
            test: /node_modules/,
            chunks: "initial",
            minSize: 0,
            minChunks: 1 //最少引入了1次
          },
          //缓存组
          common: {
            //公共模块
            chunks: "initial",
            name: "common",
            test: /[\\/]common[\\/]/,
            minSize: 100, //大小超过100个字节
            minChunks: 3 //最少引入了3次
          }
        }
      }
    }
  }
};
