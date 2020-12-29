<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="$router.push({ name: 'menu-create' })">添加菜单</el-button>
      </div>
      <el-table :data="menus" style="width: 100%">
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="name" label="菜单名称" min-width="150"></el-table-column>
        <el-table-column prop="level" label="菜单级数" min-width="150"></el-table-column>
        <el-table-column prop="icon" label="前端图标" min-width="150"></el-table-column>
        <el-table-column prop="orderNum" label="排序" min-width="150"></el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getAllMenus, deleteMenu } from '@/services/menu'

export default Vue.extend({
  name: 'MenuIndex',
  data() {
    return {
      menus: []
    }
  },
  methods: {
    async loadAllMenus() {
      const { data } = await getAllMenus()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },

    // 编辑
    handleEdit(row: any) {
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: row.id
        }
      })
    },
    // 删除
    handleDelete(row: any) {
      this.$confirm('确认删除吗？', '删除提示', {}).then(async () => {
        const { data } = await deleteMenu(row.id)
        if (data.code === '000000') {
          this.$message.success('删除成功')
          this.loadAllMenus()
        }
      })
    }
  },
  created() {
    this.loadAllMenus()
  }
})
</script>

<style lang="scss" scoped></style>
