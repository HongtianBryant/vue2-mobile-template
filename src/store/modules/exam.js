/*
 * @Author: GaoHongtian
 * @Date: 2021-02-22 18:36:45
 * @LastEditTime: 2021-03-10 13:31:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /online-exam/src/store/modules/exam.js
 */
import { userExamInfo } from '@/api/score-analysis'

const getDefaultState = () => {
  return {
    onlineQuesMap: {
    }, // paperId: { userId: '', quesAnswerMap: {}, areaImgList: []},
    additionImageList: [],
    playingState: false,
    currentAudio: {},
    examId: '',
    examNo: '',
    schoName: '',
    studId: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_QUES_MAP: (state, onlineQuesMap) => {
    state.onlineQuesMap = onlineQuesMap
  },
  SET_ADDITION_IMAGE_LIST: (state, additionImageList) => {
    state.additionImageList = additionImageList
  },
  SET_PLAYING_STATE: (state, playingState) => {
    state.playingState = playingState
  },
  SET_CURRENT_AUDIO: (state, audio) => {
    state.currentAudio = audio
  },
  SET_EXAM_ID: (state, examId) => {
    state.examId = examId
  },
  SET_SCHO_NAME: (state, schoName) => {
    state.schoName = schoName
  },
  SET_STUD_ID: (state, studId) => {
    state.studId = studId
  },
  SET_EXAM_NO: (state, examNo) => {
    state.examNo = examNo
  }
}

const actions = {
  saveOnlineQuesMap({ commit }, onlineQuesMap) {
    commit('SET_QUES_MAP', onlineQuesMap)
  },
  clearOnlineQuesMap({ commit }) {
    commit('SET_QUES_MAP', {})
  },
  saveAdditionImages({ commit }, additionImageList) {
    commit('SET_ADDITION_IMAGE_LIST', additionImageList)
  },
  clearAdditionImages({ commit }) {
    commit('SET_ADDITION_IMAGE_LIST', [])
  },
  setPlayingState({ commit }, flag) {
    commit('SET_PLAYING_STATE', flag)
  },
  saveCurrentAudio({ commit }, audio) {
    commit('SET_CURRENT_AUDIO', audio)
  },
  saveCurrentExamId({ commit }, examId) {
    commit('SET_EXAM_ID', examId)
  },
  getExamInfo({ commit }, examId) {
    return new Promise((resolve, reject) => {
      userExamInfo(examId).then(response => {
        const { success, data } = response
        if (success) {
          commit('SET_EXAM_NO', data.examNo)
          commit('SET_STUD_ID', data.studId)
          commit('SET_SCHO_NAME', data.schoName)
          resolve()
        } else {
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

