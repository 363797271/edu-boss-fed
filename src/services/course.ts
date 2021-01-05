/**
 * @/services/course.ts
 * 课程相关请求模块
 */

import request from '@/utils/request'

interface QueryData {
  currentPage?: number
  pageSize?: number
  courseName?: string
  status?: string | number // 0-草稿 1上架
}

/**
 * 分页查询课程信息
 * @param data
 */
export const getQueryCourses = (data: QueryData) => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

interface ChangeState {
  courseId: string | number
  status: string | number // 0-草稿 1上架
}
/**
 * 课程上下架
 * @param params
 */
export const changeState = (params: ChangeState) => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

/**
 * 通过课程 Id 获取课程信息
 * @param courseId
 */
export const getCourseById = (courseId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}

/**
 * 保存或者更新课程信息
 * @param data
 */
export const saveOrUpdateCourse = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

/**
 * 上传图片
 * @param data
 */
export const uploadCourseImage = (data: any, onUploadProgress?: (progressEvent: any) => void) => {
  // axios 会默认识别 FormData 数据对象，自动设置数据类型为 multipart/form-data
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // HTML5 新增的上传响应事件：progress
    // onUploadProgress(e) {
    //   console.log(e.loaded) // 已上传的数据大小
    //   console.log(e.total) // 上传文件的总大小
    // }
    onUploadProgress
  })
}
