import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'
import getters from './getters'
import user from './modules/user'
import app from './modules/app'
import exam from './modules/exam'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    app,
    exam
  },
  getters,
  plugins: [persistedState()]
})

export default store
