<template>
  <el-dialog :title="isEdit ? '编辑角色' : '添加角色'" :visible.sync="visible" @close="cannel" width="700px">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" style="margin-right:120px" v-loading="loading">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
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
import { createOrUpdateRole } from '@/services/role'
import { Form } from 'element-ui'
import Vue from 'vue'

export default Vue.extend({
  name: 'RoleDialog',
  data() {
    return {
      visible: false,
      isEdit: false,
      loading: false,
      submitLoading: false,
      form: {
        id: undefined,
        code: '',
        name: '',
        description: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'change'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入角色编码',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    open(form: any) {
      if (form) {
        this.form = { ...form }
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

        const { data } = await createOrUpdateRole(this.form)

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
    }
  }
})
</script>

<style lang="scss" scoped></style>
