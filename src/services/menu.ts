/**
 * @/services/menu.ts
 * 菜单相关请求模块
 */

import request from '@/utils/request'

interface Menu {
  id?: number
  parentId: number | -1
  name: string
  href: string
  icon: string
  orderNum: number
  description: string
  shown: boolean
}

export const createOrUpdateMenu = (data: Menu) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

export const getEditMenuInfo = (id: string | number = -1) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}

export const getAllMenus = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

export const deleteMenu = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}

export const getMenuNodeList = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}

interface Alloct {
  roleId: number | string
  menuIdList: number[]
}

export const allocateRoleMenus = (data: Alloct) => {
  return request({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data
  })
}

export const getRoleMenus = (roleId: number | string) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getRoleMenus',
    params: {
      roleId
    }
  })
}
