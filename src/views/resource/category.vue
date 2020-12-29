<template>
  <div class="resourceCategory">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="createOrEditDialogOpen(null)">添加</el-button>
      </div>
      <el-table :data="categories" style="width: 100%">
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="createdTime" label="创建时间" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.createdTime | date }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="createOrEditDialogOpen(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <category-dialog ref="createOrEditDialog" @change="createOrEditDialogChange" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getAllCategorys, deleteCategory } from '@/services/resource-category'
import CategoryDialog from './components/CategoryDialog.vue'

export default Vue.extend({
  name: 'ResourceCategoryIndex',
  components: { CategoryDialog },
  data() {
    return {
      categories: []
    }
  },
  methods: {
    async loadAllCategorys() {
      const { data } = await getAllCategorys()
      if (data.code === '000000') {
        this.categories = data.data
      }
    },

    createOrEditDialogOpen(form: any) {
      ;(this.$refs.createOrEditDialog as any).open(form)
    },
    createOrEditDialogChange() {
      this.loadAllCategorys()
    },
    // 删除
    handleDelete(row: any) {
      this.$confirm('确认删除吗？', '删除提示', {}).then(async () => {
        const { data } = await deleteCategory(row.id)
        if (data.code === '000000') {
          this.$message.success('删除成功')
          this.loadAllCategorys()
        }
      })
    }
  },
  created() {
    this.loadAllCategorys()
  }
})
</script>

<style lang="scss" scoped></style>
