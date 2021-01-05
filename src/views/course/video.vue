<template>
  <div class="course-video">
    <el-card>
      <div slot="header">上传视频</div>

      <el-form label-width="120px" label-position="right">
        <el-form-item label="课程" required>
          <el-input v-model="courseName" disabled />
        </el-form-item>
        <el-form-item label="章节" required>
          <el-input v-model="sectionName" disabled />
        </el-form-item>
        <el-form-item label="课时" required>
          <el-input v-model="lessonName" disabled />
        </el-form-item>
        <el-divider />
        <el-form-item label="视频上传">
          <input ref="video-file" type="file" :disabled="uploadLoading" />
        </el-form-item>
        <el-form-item label="封面上传">
          <input ref="image-file" type="file" :disabled="uploadLoading" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpload" :loading="uploadLoading">开始上传</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
        <el-form-item v-if="uploadLoading">
          <p>视频上传中：{{ uploadPercent }}%</p>
          <p v-if="isUploadSuccess">视频转码中：{{ isTransCodeSuccess ? '完成' : '正在处理' }}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getCourseById } from '@/services/course'
import { getByLessonId, getBySectionId } from '@/services/course-section'
import {
  aliyunImagUploadAddressAdnAuth,
  aliyunTransCode,
  aliyunTransCodePercent,
  aliyunVideoUploadAddressAdnAuth
} from '@/services/aliyun-upload'

export default Vue.extend({
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    },
    sectionId: {
      type: [String, Number],
      required: true
    },
    lessonId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      courseName: '',
      sectionName: '',
      lessonName: '',
      uploader: null,
      imageUrl: '',
      videoId: '',
      uploadLoading: false,
      isUploadSuccess: false,
      uploadPercent: 0,
      isTransCodeSuccess: false
    }
  },
  computed: {
    video(): Element {
      return (this.$refs as any)['video-file']
    },
    image(): Element {
      return (this.$refs as any)['image-file']
    }
  },
  methods: {
    async loadData() {
      try {
        const res = await Promise.all([
          getCourseById(this.courseId),
          getBySectionId(this.sectionId),
          getByLessonId(this.lessonId)
        ])

        this.courseName = res[0].data.data.courseName
        this.sectionName = res[1].data.data.sectionName
        this.lessonName = res[2].data.data.theme
      } catch (err) {
        console.error(err)
      }
    },

    initUploader() {
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo: any) => {
          console.log('onUploadstarted', uploadInfo)

          // 1. 通过我们的后端获取文件上传凭证
          let uploadAddressAndAuth
          if (uploadInfo.isImage) {
            // 获取图片上传凭证
            const { data } = await aliyunImagUploadAddressAdnAuth()
            this.imageUrl = data.data.imageURL
            uploadAddressAndAuth = data.data
          } else {
            // 获取视频上传凭证
            const { data } = await aliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageUrl
            })
            this.videoId = data.data.videoId
            uploadAddressAndAuth = data.data
          }

          // 2. 调用 uploader.setUploadAuthAndAddress 设置上传凭证
          const uploader = this.uploader as any
          uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )

          // 3. 设置好上传凭证并通过后，上传进度开始
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo: any) {
          console.log('onUploadSucceed', uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo: any, code: any, message: any) {
          console.log('onUploadFailed', uploadInfo, code, message)
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo: any, totalSize: any, loadedPercent: any) => {
          console.log('onUploadProgress', uploadInfo, totalSize, loadedPercent)
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo: any) {
          console.log('onUploadTokenExpired', uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo: any) => {
          console.log('onUploadEnd', uploadInfo)

          this.isUploadSuccess = true

          // 请求转码
          const { data } = await aliyunTransCode({
            lessonId: this.lessonId,
            coverImageUrl: this.imageUrl,
            fileId: this.videoId,
            fileName: (this.video as any).files[0].name
          })
          console.log(data)

          // 轮询查询转码进度
          let count = 0 // API 一直返回0，增加假判断
          const timer = setInterval(async () => {
            const { data } = await aliyunTransCodePercent(this.lessonId)
            count++
            console.log(data.data)
            count++
            if (data.data === 100 || count >= 10) {
              window.clearInterval(timer)
              this.uploadLoading = false
              this.isTransCodeSuccess = true
              console.log('转码成功')
            }
          }, 1000)
        }
      })
    },

    handleUpload() {
      this.uploadLoading = true
      this.isUploadSuccess = false
      this.isTransCodeSuccess = false
      this.uploadPercent = 0

      // 获取上传的文件
      const videoFile = (this.video as any).files[0]
      const imageFile = (this.image as any).files[0]

      // 将用户所选的文件添加到上传列表中
      // 一旦开始上传，它就会按照列表中添加的顺序开始上传
      const uploader = this.uploader as any
      uploader.addFile(imageFile, null, null, null, '{"Vod":{}}')
      uploader.addFile(videoFile, null, null, null, '{"Vod":{}}')

      // 开始上传，触发 onUploadstarted 事件
      uploader.startUpload()
    }
  },
  created() {
    this.loadData()
    this.initUploader()
  }
})
</script>

<style lang="scss" scoped></style>
