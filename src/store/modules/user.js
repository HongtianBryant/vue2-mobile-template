import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Notify } from 'vant'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    nickName: '',
    avatar: '',
    userId: '',
    mobile: '',
    schoolName: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_NICK_NAME: (state, nickName) => {
    state.nickName = nickName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  },
  SET_MOBILE: (state, mobile) => {
    state.mobile = mobile
  },
  SET_SCHOOL_NAME: (state, schoolName) => {
    state.schoolName = schoolName
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginText: userName.trim(), password: password }).then(response => {
        const { success, message, data } = response
        if (success) {
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        } else {
          Notify({
            message: message,
            type: 'danger',
            duration: 3 * 1000
          })
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // const { data } = response
        const { success, data } = response

        if (!success) {
          return reject('验证失败，请重新登录')
        }

        const { username, nickname, avatar, userId, mobile, schoName } = data

        commit('SET_NAME', username)
        commit('SET_NICK_NAME', nickname)
        commit('SET_AVATAR', avatar)
        commit('SET_USER_ID', userId)
        commit('SET_MOBILE', mobile)
        commit('SET_SCHOOL_NAME', schoName)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    removeToken() // must remove  token  first
    resetRouter()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

