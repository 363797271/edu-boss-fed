<template>
  <div id="app">
    <!-- 根级路由出口 -->
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
// 共享全局，不需手动注入
// @import '~@/styles/variables.scss';

.text {
  color: $success-color;
}
</style>
