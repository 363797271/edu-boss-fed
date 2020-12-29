// @/store/index.ts
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 容器的状态实现了数据共享,方便在组件中访问，但是没有持久化的功能
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null') // 当前登录用户状态
  },
  mutations: {
    // 修改容器数据必须是哟个 mutation 函数
    setUser(state, payload) {
      state.user = JSON.parse(payload)

      // 为了防止页面刷新数据丢失，需要把 user 数据持久化
      // 注意：本地存储只能存字符串
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {},
  modules: {}
})
