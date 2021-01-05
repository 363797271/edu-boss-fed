// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      scss: {
        // @/ 是 src/ 的别名
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        // additionalData: '@import "~@/styles/variables.scss";'
        prependData: '@import "~@/styles/variables.scss";'
      }
    }
  },
  devServer: {
    // 此代理仅针对本地开发服务 (npm run serve)
    proxy: {
      '/boss': {
        target: 'http://eduboss.lagou.com',
        changeOrigin: true
      },
      '/front': {
        target: 'http://edufront.lagou.com',
        changeOrigin: true
      }
    }
  }
}
