<template>
  <div class="course-image">
    <el-progress
      v-if="isUploading"
      type="circle"
      :percentage="percentage"
      :status="percentage === 100 ? 'success' : undefined"
      :width="178"
    />
    <el-upload
      v-else
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="handleUpload"
    >
      <img v-if="value" :src="value" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script lang="ts">
import { uploadCourseImage } from '@/services/course'
import Vue from 'vue'

export default Vue.extend({
  name: 'CourseImage',
  props: {
    value: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      isUploading: false,
      percentage: 0
    }
  },
  methods: {
    async handleUpload(options: any) {
      this.isUploading = true
      const fd = new FormData()
      fd.append('file', options.file)
      const { data } = await uploadCourseImage(fd, e => {
        this.percentage = Math.floor((e.loaded / e.total) * 100)
      })
      this.isUploading = false
      this.percentage = 0
      this.$emit('input', data.data.name)
    },
    beforeAvatarUpload(file: any) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < this.limit

      if (!(isJPG || isPNG)) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error(`上传头像图片大小不能超过 ${this.limit}MB!`)
      }
      return (isJPG || isPNG) && isLt2M
    }
  }
})
</script>

<style lang="scss" scoped>
.avatar-uploader ::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader ::v-deep .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
