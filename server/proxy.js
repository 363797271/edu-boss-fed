/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
  let target = ''

  // 代理目标地址
  if (req.url.startsWith('/front/')) {
    target = 'http://edufront.lagou.com/'
  } else if (req.url.startsWith('/boss/')) {
    target = 'http://eduboss.lagou.com/'
  }

  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true
  })
}
