/**
 * @/services/aliyun-upload.ts
 * 案例云上传相关请求模块
 */

import request from '@/utils/request'

/**
 * 获取阿里云图片上传凭证
 */
export const aliyunImagUploadAddressAdnAuth = () => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunImagUploadAddressAdnAuth.json'
  })
}

interface QueryData {
  fileName: string // 视频文件名
  imageUrl: string // 封面图片地址
}
/**
 * 获取阿里云视频上传凭证
 * @param params
 */
export const aliyunVideoUploadAddressAdnAuth = (params: QueryData) => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json',
    params
  })
}

interface PostData {
  lessonId: string | number // 课时id
  coverImageUrl: string // 封面图片地址
  fileId: string | number // 视频文件id
  fileName: string // 视频文件名
}
/**
 * 阿里云转码请求
 * @param data
 */
export const aliyunTransCode = (data: PostData) => {
  return request({
    method: 'POST',
    url: '/boss/course/upload/aliyunTransCode.json',
    data
  })
}

/**
 * 阿里云转码进度
 * @param lessonId
 */
export const aliyunTransCodePercent = (lessonId: string | number) => {
  return request({
    method: 'GET',
    url: 'boss/course/upload/aliyunTransCodePercent.json',
    params: {
      lessonId
    }
  })
}
