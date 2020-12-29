<template>
  <el-dialog :title="isEdit ? '编辑资源' : '添加资源'" :visible.sync="visible" @close="cannel" width="700px">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" style="margin-right:120px" v-loading="loading">
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="资源路径" prop="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="资源分类" prop="categoryId">
        <el-select v-model="form.categoryId">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="form.description"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cannel">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submit" :disabled="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { createOrUpdateResource, getResourceInfo } from '@/services/resource'
import { getAllCategorys } from '@/services/resource-category'
import { Form } from 'element-ui'
import Vue from 'vue'

export default Vue.extend({
  name: 'ResourceDialog',
  data() {
    return {
      visible: false,
      isEdit: false,
      loading: false,
      submitLoading: false,
      categories: [],
      form: {
        id: undefined,
        name: '',
        categoryId: '',
        url: '',
        description: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入资源名称',
            trigger: 'change'
          }
        ],
        url: [
          {
            required: true,
            message: '请输入资源路径',
            trigger: 'change'
          }
        ],
        categoryId: [
          {
            required: true,
            message: '请选择资源分类',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    async loadAllCategorys() {
      const { data } = await getAllCategorys()
      if (data.code === '000000') {
        this.categories = data.data
      }
    },
    open(form: any) {
      this.loadAllCategorys()
      if (form) {
        this.getResourceInfo(form.id)
      } else {
        this.loading = false
      }
      this.isEdit = !!form
      this.visible = true
    },
    cannel() {
      ;(this.$refs.form as Form).resetFields()
      this.visible = false
    },
    async submit() {
      this.submitLoading = true
      try {
        ;(this.$refs.form as Form).validate()

        const { data } = await createOrUpdateResource(this.form)

        if (data.code === '000000') {
          this.$message.success('提交成功')
          this.$emit('change')
          this.cannel()
        } else {
          this.$message.error('提交失败')
        }
      } catch (error) {
        this.$message.error('提交失败')
      }
      this.submitLoading = false
    },
    async getResourceInfo(id: number) {
      this.loading = true
      try {
        const { data } = await getResourceInfo(id)
        if (data.code === '000000') {
          this.form = data.data
          this.loading = false
        } else {
          this.$message.error(`获取资源信息失败：${data.mesg}`)
        }
      } catch (error) {
        this.$message.error('获取资源信息失败，请关闭弹窗重新尝试')
      }
    }
  }
})
</script>

<style lang="scss" scoped></style>
