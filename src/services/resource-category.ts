/**
 * @/services/resource-category.ts
 * 资源分类相关请求模块
 */

import request from '@/utils/request'

interface Category {
  id?: number
  name: string
  sort: string | number
}

export const getAllCategorys = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

export const createOrUpdateCategory = (data: Category) => {
  return request({
    method: 'POST',
    url: '/boss/resource/category/saveOrderUpdate',
    data
  })
}

export const deleteCategory = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/category/${id}`
  })
}
