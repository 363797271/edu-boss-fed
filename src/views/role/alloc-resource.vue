<template>
  <div class="alloc-resource">
    <el-card>
      <div
        v-for="(item, index) in categoryList"
        :key="item.id"
        :class="{
          'top-line': index === 0
        }"
      >
        <el-row class="table-layout" style="background: rgb(242, 246, 252);">
          <el-checkbox
            :indeterminate="item.indeterminate"
            :disabled="item.resourceList === null"
            v-model="item.checkAll"
            @change="val => handleCheckAllChange(val, item)"
          >
            {{ item.name }}
          </el-checkbox>
        </el-row>
        <el-row class="table-layout">
          <el-checkbox-group v-model="checkList" @change="handleCheckedItemChange(item)">
            <el-col :span="8" v-for="resource in item.resourceList" :key="resource.id" style="padding: 4px 0px;">
              <el-checkbox :label="resource.id">{{ resource.name }}</el-checkbox>
            </el-col>
          </el-checkbox-group>
        </el-row>
      </div>
      <div style="text-align:center;margin-top:20px">
        <el-button @click="clear">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import { allocateRoleResources, getRoleResources } from '@/services/resource'
import Vue from 'vue'

export default Vue.extend({
  name: 'AllocResource',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      categoryList: [],
      checkList: []
    }
  },
  methods: {
    async loadRoleResources() {
      const { data } = await getRoleResources(this.roleId)
      if (data.code === '000000') {
        this.categoryList = data.data.map((v: any) => {
          if (v.resourceList === null) {
            return {
              ...v,
              checkAll: false,
              indeterminate: false
            }
          }
          const hasSelected = v.resourceList.some((v: any) => v.selected)
          const hasUnSelected = v.resourceList.some((v: any) => !v.selected)
          return {
            ...v,
            checkAll: !hasUnSelected,
            indeterminate: hasSelected && hasUnSelected
          }
        })
        this.getCheckedIds(data.data)
      }
    },

    getCheckedIds(categoryList: any) {
      categoryList.forEach((category: any) => {
        if (category.resourceList) {
          const ids = category.resourceList.filter((v: any) => v.selected).map((v: any) => v.id)
          ;(this.checkList as any[]).push(...ids)
        }
      })
    },

    // 勾选资源分类
    handleCheckAllChange(checked: boolean, item: any) {
      const ids = item.resourceList.map((v: any) => v.id)
      if (checked) {
        ;(this.checkList as any[]) = Array.from(new Set([...this.checkList, ...ids]))
      } else {
        this.checkList = this.checkList.filter(v => !ids.includes(v))
      }
      item.indeterminate = false
    },
    // 勾选单个资源
    handleCheckedItemChange(item: any) {
      const ids = item.resourceList.map((v: any) => v.id)
      const hasSelected = ids.some((v: any) => (this.checkList as any).includes(v))
      const hasUnSelected = ids.some((v: any) => !(this.checkList as any).includes(v))
      item.indeterminate = hasSelected && hasUnSelected
    },

    async onSave() {
      const { data } = await allocateRoleResources({
        roleId: this.roleId,
        resourceIdList: this.checkList
      })

      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.$router.push({
          name: 'role'
        })
      } else {
        this.$message.error('提交失败')
      }
    },
    clear() {
      this.checkList = []
      this.categoryList.forEach((v: any) => {
        v.checkAll = false
        v.indeterminate = false
      })
    }
  },
  created() {
    this.loadRoleResources()
  }
})
</script>

<style lang="scss" scoped>
.top-line {
  border-top: 1px solid #dcdfe6;
}
.table-layout {
  padding: 20px;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
}
</style>
