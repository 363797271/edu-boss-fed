/**
 * @/services/course-section.ts
 * 课程章节相关请求模块
 */

import request from '@/utils/request'

/**
 * 获取所有章节信息
 * @param courseId
 */
export const getSectionAndLesson = (courseId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

/**
 * 添加/编辑章节
 * @param data
 */
export const saveOrUpdateSection = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}

/**
 * 根据ID获取章节详情
 * @param sectionId
 */
export const getBySectionId = (sectionId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getBySectionId',
    params: {
      sectionId
    }
  })
}

/**
 * 添加/编辑课时
 * @param data
 */
export const saveOrUpdateLesson = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data
  })
}

/**
 * 根据ID获取课时详情
 * @param lessonId
 */
export const getByLessonId = (lessonId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/course/lesson/getById',
    params: {
      lessonId
    }
  })
}
