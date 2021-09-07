const getDefaultState = () => {
  return {
    activeTabbar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ACTIVE_TABBAR: (state, activeTabbar) => {
    state.activeTabbar = activeTabbar
  }
}

const actions = {
  changeTabbar({ commit }, activeTabbar) {
    commit('SET_ACTIVE_TABBAR', activeTabbar)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

