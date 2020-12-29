// /src/utils/request.ts
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
  // baseURL
  // timeout
})

function redirectLogin() {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken() {
  // 注意为避免重复进入拦截器，使用新的 axios 实例发起请求
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在这里通过改写 config 配置信息来实现业务功能的统一处理
    const { user } = store.state
    if (user && user.access_token) {
      config.headers.Authorization = user.access_token
    }

    // 注意：这里一定要返回 config，否则请求发不出去
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器
let isRefreshing = false // 控制刷新 token 的状态
let requests: any[] = [] // 存储刷新 token 期间过来的 401 请求
request.interceptors.response.use(
  response => {
    // 当状态码为 2xx 都会执行这里
    return response
  },
  async error => {
    // 超出 2xx 状态码都执行这里

    if (error.response) {
      // 请求发出去收到响应，但是状态码超出了 2xx 范围
      const { status } = error.response
      if (status === 400) {
        Message.error('请求参数错误')
      } else if (status === 401) {
        // token 无效（token无效、过期或没有提供token）

        // 判断是否有 refresh_token
        // 如果没有 -> 则直接跳转登录页
        if (!store.state.user) {
          redirectLogin()
          return Promise.reject(error)
        }

        // 刷新 token
        if (!isRefreshing) {
          isRefreshing = true // 开启刷新状态

          // 如果有 -> 则尝试使用 refresh_token 获取新的 access_token
          return refreshToken()
            .then(res => {
              if (!res.data.success) {
                throw new Error('刷新 Token 失败')
              }
              //   成功
              //   1. 把成功刷新拿到的新的 access_token 更新到容器和本地存储中
              store.commit('setUser', res.data.content)
              //   2. 把 requests 队列中的请求重新发出去
              requests.forEach(cb => cb())
              // 重置 requests 数组
              requests = []
              return request(error.config)
            })
            .catch(() => {
              //   失败
              //   1. 把当前登录用户状态清除
              store.commit('setUser', null)
              //   2. 跳转登录页
              redirectLogin()
              return Promise.reject(error)
            })
            .finally(() => {
              isRefreshing = false // 重置刷新状态
            })
        }

        // 刷新状态下，把请求挂起放到 requests 数组中
        return new Promise(resolve => {
          requests.push(() => {
            resolve(request(error.config))
          })
        })
      } else if (status === 403) {
        Message.error('没有权限，请联系管理员')
      } else if (status === 404) {
        Message.error('请求资源不存在')
      } else if (status >= 500) {
        Message.error('服务端错误，请联系管理员')
      }
    } else if (error.request) {
      // 请求发出没有收到响应，例如超时、网络断开等
      Message.error('请求超时，请刷新重试')
    } else {
      // 在设置请求时发生了一些事情，触发了一个错误
      Message.error(`请求失败：${error.message}`)
    }

    // 把请求失败的错误对象继续抛出，扔给上一个调用者
    return Promise.reject(error)
  }
)

export default request
