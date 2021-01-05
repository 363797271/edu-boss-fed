/**
 * @/services/role.ts
 * 角色相关请求模块
 */

import request from '@/utils/request'

interface Role {
  id?: number
  code: string
  name: string
  description: string
}

export const createOrUpdateRole = (data: Role) => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

interface QueryData {
  name?: string
  url?: string
  code?: string
  current: number
  size: number
}

export const getRolePages = (data: QueryData) => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

export const deleteRole = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

export const getAllRoles = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

interface Allocate {
  userId: number
  roleIdList?: number[]
}

export const allocateUserRoles = (data: Allocate) => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

/**
 * 获取用户的角色
 * @param userId
 */
export const getUserRole = (userId: number) => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
