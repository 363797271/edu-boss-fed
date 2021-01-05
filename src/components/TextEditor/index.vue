<template>
  <div ref="editor" class="text-editor"></div>
</template>
<script lang="ts">
import { uploadCourseImage } from '@/services/course'
import Vue from 'vue'
import E from 'wangeditor'
export default Vue.extend({
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    initEditor() {
      const editor = new E(this.$refs.editor as any)
      // 配置 onchange 回调函数
      editor.config.onchange = (value: string) => {
        this.$emit('input', value)
      }

      // 自定义实现上传图片
      editor.config.customUploadImg = async function(resultFiles: any, insertImgFn: any) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法

        // 上传图片，返回结果，将图片插入到编辑器中

        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)

        if (data.code === '000000') {
          insertImgFn(data.data.name)
        }
      }

      editor.create()

      editor.txt.html(this.value) // 重新设置编辑器内容
    }
  }
})
</script>

<style lang="scss" scoped></style>
