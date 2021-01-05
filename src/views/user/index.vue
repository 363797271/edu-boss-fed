<template>
  <div class="user">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="queryForm" inline :model="queryData" label-width="120px">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="queryData.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="createTime">
            <el-date-picker
              v-model="createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button :loading="isLoading" type="primary" @click="query">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="users" style="width: 100%" v-loading="isLoading">
        <el-table-column prop="id" label="用户ID" width="120"></el-table-column>
        <el-table-column prop="portrait" label="头像" width="100">
          <template slot-scope="scope">
            <el-avatar
              style="vertical-align: middle;"
              size="small"
              :src="scope.row.portrait || require('@/assets/default-avatar.png')"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="createTime" label="注册时间" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.createdTime | date }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <i
              :class="{
                status: true,
                'status-danger': scope.row.status === 'DISABLE',
                'status-success': scope.row.status === 'ENABLE'
              }"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="changeStatus(scope.row)">
              {{ scope.row.status === 'DISABLE' ? '启用' : '禁用' }}
            </el-button>
            <el-button size="mini" type="text" @click="handleSelectRole(scope.row.id)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:20px;text-align:right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :disabled="isLoading"
      >
      </el-pagination>
    </el-card>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialog.visible" width="500px">
      <el-select v-model="dialog.roleIdList" multiple placeholder="请选择" style="width:100%" clearable>
        <el-option v-for="item in dialog.roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span slot="footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleAllocRole">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { enableUser, forbidUser, getUserPages } from '@/services/user'
import { allocateUserRoles, getAllRoles, getUserRole } from '@/services/role'

export default Vue.extend({
  name: 'UserIndex',
  data() {
    return {
      isLoading: true,
      users: [],
      createTime: [],
      queryData: {
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        currentPage: 1, // 分页页码
        pageSize: 10 // 每页大小
      },
      total: 0,
      dialog: {
        visible: false,
        roles: [],
        roleIdList: [],
        userId: 0
      }
    }
  },
  methods: {
    async loadUsers() {
      this.isLoading = true
      if (this.createTime && this.createTime.length > 0) {
        this.queryData.startCreateTime = this.createTime[0]
        this.queryData.endCreateTime = this.createTime[1]
      } else {
        this.queryData.startCreateTime = ''
        this.queryData.endCreateTime = ''
      }
      const { data } = await getUserPages(this.queryData)
      if (data.code === '000000') {
        this.users = data.data.records
        this.total = data.data.total
      }
      this.isLoading = false
    },
    query() {
      this.queryData.currentPage = 1
      this.loadUsers()
    },

    handleSizeChange(val: number) {
      this.queryData.pageSize = val
      this.queryData.currentPage = 1
      this.loadUsers()
    },
    handleCurrentChange(val: number) {
      this.queryData.currentPage = val
      this.loadUsers()
    },

    async handleSelectRole(userId: number) {
      this.dialog.userId = userId
      try {
        const res = await Promise.all([getAllRoles(), getUserRole(userId)])

        if (res[0].data.code !== '000000') {
          throw Error(res[0].data.mesg)
        }
        if (res[1].data.code !== '000000') {
          throw Error(res[1].data.mesg)
        }
        this.dialog.roles = res[0].data.data
        this.dialog.roleIdList = res[1].data.data.map((v: any) => v.id)
        this.dialog.visible = true
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    async handleAllocRole() {
      const { userId, roleIdList } = this.dialog
      const { data } = await allocateUserRoles({
        userId,
        roleIdList
      })
      if (data.code === '000000') {
        this.$message.success('处理成功')
        this.dialog.visible = false
      } else {
        this.$message.error('处理失败')
      }
    },

    async changeStatus(row: any) {
      const { userId, status } = row
      const { data } = await (status === 'DISABLE' ? enableUser(userId) : forbidUser(userId))
      if (data.code === '000000') {
        this.$message.success('处理成功')
        this.loadUsers()
      } else {
        this.$message.error('处理失败')
      }
    }
  },
  created() {
    this.loadUsers()
  }
})
</script>

<style lang="scss" scoped>
.user {
  .status {
    display: inline-block;
    cursor: pointer;
    width: 0.875rem;
    height: 0.875rem;
    vertical-align: middle;
    border-radius: 50%;
    &.status-success {
      background: #51cf66;
    }
    &.status-danger {
      background: #ff6b6b;
    }
  }
}
</style>
