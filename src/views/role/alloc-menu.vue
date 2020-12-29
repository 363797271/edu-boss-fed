<template>
  <div class="alloc-menu">
    <el-card>
      <div slot="header"><span>分配权限</span></div>
      <el-tree
        ref="menu-tree"
        :data="menus"
        node-key="id"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        show-checkbox
        default-expand-all
        check-strictly
      ></el-tree>
      <div style="text-align:center">
        <el-button @click="clear">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import { allocateRoleMenus, getMenuNodeList, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'
import Vue from 'vue'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  methods: {
    async loadMenus() {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    async loadRoleMenus() {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },

    getCheckedKeys(menus: any) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          this.checkedKeys = [...this.checkedKeys, menu.id as never]
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList)
        }
      })
    },

    async onSave() {
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
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
      ;(this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    }
  },
  created() {
    this.loadMenus()
    this.loadRoleMenus()
  }
})
</script>

<style lang="scss" scoped></style>
