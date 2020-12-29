/**
 * @/services/resource.ts
 * 资源相关请求模块
 */

import request from '@/utils/request'

interface Resource {
  id?: number
  name: string
  categoryId: number | string
  url: string
  description: string
}

export const createOrUpdateResource = (data: Resource) => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

export const getResourceInfo = (id: number) => {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}

interface QueryData {
  name?: string
  url?: string
  categoryId?: number | string
  current: number
  size: number
}

export const getResourcePages = (data: QueryData) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

export const deleteResource = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}

export const getRoleResources = (roleId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId
    }
  })
}
