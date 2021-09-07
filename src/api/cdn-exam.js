import axios from 'axios'

const cdnBaseUrl = process.env.VUE_APP_CDN_BASE_URL
const randomNum = parseInt((1 + Math.random()) * 65536)

/**
 * @description 试卷试题list--从cdn获取
 * @param paperId 试卷id
 * */
export function getCdnPaperQuesList(paperId) {
  return axios({
    method: 'GET',
    timeout: 2000,
    url: `${cdnBaseUrl}/online-exam-papers/${paperId}.json?r=${randomNum}`
  })
}
