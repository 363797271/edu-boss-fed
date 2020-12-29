import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/element'
import './styles/index.scss'

import dayjs from 'dayjs'

Vue.config.productionTip = false

Vue.filter('date', (value: string | number | Date | dayjs.Dayjs | undefined, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(fmt)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
