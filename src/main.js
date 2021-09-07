import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

import router from './router'
import store from './store'

import 'normalize.css/normalize.css'
import 'vant/lib/index.css'
import '@/styles/index.scss'

import '@/icons' // icon
import '@/permission' // permission control

Sentry.init({
  Vue: Vue,
  dsn: 'https://d7338ee7492145b8a8631ad977d5205d@trace.521ke.com/10',
  integrations: [new Integrations.BrowserTracing()],
  tracingOptions: {
    trackComponents: true
  },
  environment: process.env.NODE_ENV
})

Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
