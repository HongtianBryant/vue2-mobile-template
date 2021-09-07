import request from '@/utils/request'

/**
 * @description 当前用户考试列表
 * */
export function getStudentExamList() {
  return request({
    url: '/eExamTaking/getStudentExams',
    method: 'get'
  })
}

/**
 * @description 考试试卷列表
 * @param examId 考试id
 * */
export function getExamPaperList(examId) {
  return request({
    url: '/onlineExam/findSchoOnlinePapers',
    method: 'get',
    params: {
      examId
    }
  })
}

/**
 * @description 试卷试题list （已经拆分为以下2个接口）
 * @param examId 考试id
 * @param paperId 试卷id
 * */
export function getPaperQuesList(examId, paperId) {
  return request({
    url: '/onlineExam/getWXQuestionInlinelist',
    method: 'get',
    params: {
      examId,
      paperId
    }
  })
}

/**
 * @description 试卷试题list--只包含试题信息
 * @param examId 考试id
 * @param paperId 试卷id
 * */
export function getPaperQuesInfoList(examId, paperId) {
  return request({
    url: '/onlineExam/listQuestionInfos',
    method: 'get',
    params: {
      examId,
      paperId
    }
  })
}

/**
 * @description 试卷信息--只包含试卷config
 * @param examId 考试id
 * @param paperId 试卷id
 * */
export function getPaperInfo(examId, paperId) {
  return request({
    url: '/onlineExam/getPaperInfo',
    method: 'get',
    params: {
      examId,
      paperId
    }
  })
}

/**
 * @description 试卷主观题题块--在线作答 录答案
 * @param examId 考试id
 * @param paperId 试卷id
 * */
export function getSubjectAreaList(examId, paperId) {
  return request({
    url: '/onlineExam/listSubjectAreas',
    method: 'get',
    params: {
      examId,
      paperId
    }
  })
}

/**
 * @description 主观题补录接口 /onlineExam/listAreaAndImages
 * @param examId 考试id
 * @param paperId 试卷id
 */
export function getQuesAreaImgList(examId, paperId, subName) {
  return request({
    url: '/onlineExam/listAreaAndImages',
    method: 'get',
    params: {
      examId,
      paperId,
      subName
    }
  })
}

/**
 * @description 在线考试 录答案提交接口
 * @param paperId 试卷id
 * @param data 试题
 * */
export function savePaperQuesResult(data, paperId) {
  return request({
    url: '/onlineExam/savePaperStuQuestion',
    method: 'post',
    params: {
      paperId
    },
    data: data
  })
}

/**
 * @description 补录图片提交接口
 * @param paperId 试卷id
 * @param data 图片对象
 * */
export function savePaperQuesImg(data, paperId) {
  return request({
    url: '/onlineExam/additionSavePaperStuQuestion',
    method: 'post',
    params: {
      paperId
    },
    data: data
  })
}

/**
 * @description 看解析接口
 * @param paperId 试卷id
 * @param data 图片对象
 */
export function getPaperQuesAnalysisList(examId, paperId) {
  return request({
    url: '/onlineExam/getWXQuestionlistAnaly',
    method: 'get',
    params: {
      examId,
      paperId
    }
  })
}