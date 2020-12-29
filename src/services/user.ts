/**
 * @/services/user.ts
 * 用户相关请求模块
 */

import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string
  password: string
}

export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // `Axios` 当发现 `data` 的值是 `qs` 转化后的格式，会自动将 请求头 的 `Content-Type` 设置为 `application/x-www-form-urlencoded`。
    // headers: {
    //   'content-type': 'application/x-www-form-urlencoded'
    // },
    data: qs.stringify(data)
  })
}

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}
