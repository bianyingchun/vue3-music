import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import compress from "vite-plugin-compress";
import vitePluginImp from "vite-plugin-imp";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vitePluginImp({
      libList: [
        {
          libName: "lodash",
          libDirectory: "",
          camel2DashComponentName: false,
        },
      ],
    }),
    // compress(
    //   //生成压缩包gz
    //   {
    //     verbose: true,
    //     disable: false,
    //     threshold: 10240,
    //     algorithm: "gzip",
    //     ext: ".gz",
    //   }
    // ),
    visualizer(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/common/scss/global.scss";`,
      },
    },
  },
  server: {
    host: true,
    port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
  },
  base: "./",
  build: {
    // minify: "esbuild",
    // chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // 拆分代码，这个就是分包，配置完后自动按需加载，现在还比不上webpack的splitchunk，不过也能用了。
          vue: ["vue", "vue-router", "pinia"],
        },
      },
    },
  },
});
