<template>
  <div class="role">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="queryForm" inline :model="queryData" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="queryData.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="isLoading" @click="reset">重置</el-button>
            <el-button :loading="isLoading" type="primary" @click="query">查询搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button size="small" type="primary" @click="createOrEditDialogOpen()">添加角色</el-button>
      <el-divider />
      <el-table :data="roles" style="width: 100%" v-loading="isLoading">
        <el-table-column type="index" label="编号" :index="indexMethod"></el-table-column>
        <el-table-column prop="name" label="角色名称" min-width="150"></el-table-column>
        <el-table-column prop="description" label="描述" min-width="150"></el-table-column>
        <el-table-column prop="createdTime" label="添加时间" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.createdTime | date }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="$router.push({ name: 'alloc-menu', params: { roleId: scope.row.id } })"
              >分配菜单</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="$router.push({ name: 'alloc-resource', params: { roleId: scope.row.id } })"
              >分配资源</el-button
            >
            <el-button size="mini" type="text" @click="createOrEditDialogOpen(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:20px;text-align:right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryData.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :disabled="isLoading"
      >
      </el-pagination>
    </el-card>
    <create-or-edit-dialog ref="createOrEditDialog" @change="createOrEditDialogChange" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getRolePages, deleteRole } from '@/services/role'
import CreateOrEditDialog from './components/CreateOrEditDialog.vue'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'RoleIndex',
  components: { CreateOrEditDialog },
  data() {
    return {
      isLoading: true,
      roles: [],
      queryData: {
        name: '',
        url: '',
        categoryId: '',
        current: 1, // 分页页码
        size: 10 // 每页大小
      },
      total: 0
    }
  },
  methods: {
    async loadRoles() {
      this.isLoading = true
      const { data } = await getRolePages(this.queryData)
      if (data.code === '000000') {
        this.roles = data.data.records
        this.total = data.data.total
      }
      this.isLoading = false
    },
    query() {
      this.queryData.current = 1
      this.loadRoles()
    },
    reset() {
      ;(this.$refs.queryForm as Form).resetFields()
      this.query()
    },

    createOrEditDialogOpen(form: any) {
      ;(this.$refs.createOrEditDialog as any).open(form)
    },
    createOrEditDialogChange() {
      this.loadRoles()
    },
    // 删除
    handleDelete(row: any) {
      this.$confirm('确认删除吗？', '删除提示', {}).then(async () => {
        const { data } = await deleteRole(row.id)
        if (data.code === '000000') {
          this.$message.success('删除成功')
          this.loadRoles()
        }
      })
    },

    indexMethod(index: number) {
      return (this.queryData.current - 1) * this.queryData.size + index + 1
    },
    handleSizeChange(val: number) {
      this.queryData.size = val
      this.queryData.current = 1
      this.loadRoles()
    },
    handleCurrentChange(val: number) {
      this.queryData.current = val
      this.loadRoles()
    }
  },
  created() {
    this.loadRoles()
  }
})
</script>

<style lang="scss" scoped></style>
