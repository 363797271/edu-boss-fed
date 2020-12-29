<template>
  <div class="menu-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑菜单' : '添加菜单' }}</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="href">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <el-option label="无上级菜单" :value="-1"></el-option>
            <el-option v-for="menu in parentMenuList" :key="menu.id" :label="menu.name" :value="menu.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="shown">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="loading">提交</el-button>
          <el-button @click="resetForm" v-if="!isEdit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { createOrUpdateMenu, getEditMenuInfo } from '@/services/menu'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'MenuCreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      form: {
        parentId: -1, // -1 表示没有上级菜单
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: false
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'change'
          }
        ],
        href: [
          {
            required: true,
            message: '请输入菜单路径',
            trigger: 'change'
          }
        ]
      },
      parentMenuList: [] // 父级菜单列表
    }
  },
  methods: {
    async onSubmit() {
      this.loading = true
      try {
        await (this.$refs.form as Form).validate()

        const { data } = await createOrUpdateMenu(this.form)

        if (data.code === '000000') {
          this.$message.success('提交成功')
          this.$router.push({
            name: 'menu'
          })
        }
      } catch (error) {
        this.$message.error('提交失败')
      }
      this.loading = false
    },

    async loadMenuInfo() {
      const { data } = await getEditMenuInfo(this.$route.params.id || -1)
      if (data.code === '000000') {
        this.parentMenuList = data.data.parentMenuList
        if (this.isEdit) {
          this.form = data.data.menuInfo
        }
      }
    },

    resetForm() {
      ;(this.$refs.form as Form).resetFields()
    }
  },
  created() {
    this.loadMenuInfo()
  }
})
</script>

<style lang="scss" scoped></style>
