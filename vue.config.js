module.exports = {
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  css: {
    loaderOptions: {
      less: {
        // 若使用 less-loader@5，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            // "text-color": "#111",
            // "border-color": "#eee",
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            // hack: `true; @import "your-less-file-path.less";`
          }
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        common: "@/common",
        components: "@/components",
        network: "@/network",
        views: "@/views",
        style: "@/style"
      }
    }
  }
  // chainWebpack: config => {
  //   const svgRule = config.module.rule("svg");
  //
  //   // 清除已有的所有 loader。
  //   // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
  //   svgRule.uses.clear();
  //
  //   // 添加要替换的 loader
  //   svgRule.use("raw-loader").loader("raw-loader");
  // }
};
