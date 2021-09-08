import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant'

import router from './router'
import store from './store'

import 'normalize.css/normalize.css'
import 'vant/lib/index.css'
import '@/styles/index.scss'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
