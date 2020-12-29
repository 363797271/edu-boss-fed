<template>
  <el-dialog :title="isEdit ? '编辑分类' : '添加分类'" :visible.sync="visible" @close="cannel">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" style="margin-right:120px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cannel">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { createOrUpdateCategory } from '@/services/resource-category'
import { Form } from 'element-ui'
import Vue from 'vue'

export default Vue.extend({
  name: 'CategoryDialog',
  data() {
    return {
      visible: false,
      isEdit: false,
      submitLoading: false,
      form: {
        id: undefined,
        name: '',
        sort: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'change'
          }
        ],
        sort: [
          {
            required: true,
            message: '请输入排序',
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

        const { data } = await createOrUpdateCategory(this.form)

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
