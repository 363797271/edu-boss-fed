<template>
  <div class="course">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="queryForm" inline :model="queryData" label-width="120px">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="queryData.courseName" placeholder="请输入课程名称"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryData.status">
              <el-option label="全部" value=""></el-option>
              <el-option label="上架" value="1"></el-option>
              <el-option label="下架" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :loading="isLoading" type="primary" @click="query">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button
        size="small"
        type="primary"
        @click="
          $router.push({
            name: 'course-create'
          })
        "
        >添加课程</el-button
      >
      <el-divider />
      <el-table :data="courses" style="width: 100%" v-loading="isLoading">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="courseName" label="课程名称"></el-table-column>
        <el-table-column prop="price" label="价格">
          <template slot-scope="scope">￥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column prop="sortNum" label="排序"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="changeStatus(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="
                $router.push({
                  name: 'course-edit',
                  params: {
                    courseId: scope.row.id
                  }
                })
              "
              >编辑</el-button
            >
            <el-button
              size="mini"
              @click="
                $router.push({
                  name: 'course-section',
                  params: {
                    courseId: scope.row.id
                  }
                })
              "
              >内容管理</el-button
            >
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
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { changeState, getQueryCourses } from '@/services/course'

export default Vue.extend({
  name: 'CourseIndex',
  data() {
    return {
      isLoading: true,
      courses: [],
      queryData: {
        courseName: '',
        status: '',
        currentPage: 1, // 分页页码
        pageSize: 10 // 每页大小
      },
      total: 0
    }
  },
  methods: {
    async loadCourses() {
      this.isLoading = true
      const { data } = await getQueryCourses(this.queryData)
      if (data.code === '000000') {
        this.courses = data.data.records.map((v: any) => {
          return {
            ...v,
            isStatusLoading: false
          }
        })
        this.total = data.data.total
      }
      this.isLoading = false
    },
    query() {
      this.queryData.currentPage = 1
      this.loadCourses()
    },

    handleSizeChange(val: number) {
      this.queryData.pageSize = val
      this.queryData.currentPage = 1
      this.loadCourses()
    },
    handleCurrentChange(val: number) {
      this.queryData.currentPage = val
      this.loadCourses()
    },

    async changeStatus(row: any) {
      const { id: courseId, status } = row
      row.isStatusLoading = true
      try {
        const { data } = await changeState({
          courseId,
          status
        })
        const title = row.status === 1 ? '上架' : '下架'
        if (data.code === '000000') {
          this.$message.success(`${title}成功`)
        } else {
          row.status = row.status === 1 ? 0 : 1
          this.$message.error(`${title}失败`)
        }
      } catch (error) {
        row.status = row.status === 1 ? 0 : 1
      }
      row.isStatusLoading = false
    }
  },
  created() {
    this.loadCourses()
  }
})
</script>

<style lang="scss" scoped></style>
