<template>
  <div class="alloc-resource">
    <el-card>
      <el-checkbox-group v-model="checkList">
        <div
          v-for="(item, index) in resources"
          :key="item.id"
          :class="{
            'top-line': index === 0
          }"
        >
          <el-row class="table-layout" style="background: rgb(242, 246, 252);">
            <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
          </el-row>
          <el-row class="table-layout">
            <el-col :span="8" v-for="resource in item.resourceList" :key="resource.id" style="padding: 4px 0px;">
              <el-checkbox :label="resource.id">{{ resource.name }}</el-checkbox>
            </el-col>
          </el-row>
        </div>
      </el-checkbox-group>
    </el-card>
  </div>
</template>
<script lang="ts">
import { getRoleResources } from '@/services/resource'
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
      resources: [],
      checkList: []
    }
  },
  methods: {
    async loadRoleResources() {
      const { data } = await getRoleResources(this.roleId)
      if (data.code === '000000') {
        this.resources = data.data
        this.getCheckedIds(data.data)
      }
    },

    getCheckedIds(resources: any) {
      resources.forEach((resource: any) => {
        if (resource.selected) {
          this.checkList = [...this.checkList, resource.id] as any
        }
        if (resource.resourceList) {
          this.getCheckedIds(resource.resourceList)
        }
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
