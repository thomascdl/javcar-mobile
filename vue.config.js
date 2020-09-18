module.exports = {
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
};
