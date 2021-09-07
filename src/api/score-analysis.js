import request from '@/utils/request'
import qs from 'qs'

/**
 * @description: 根据examId获得其他考试字段
 * @param {*} examId
 * @return {*} /eExamAnalysis/userExamInfo
 */
export function userExamInfo(examId) {
  return request({
    url: '/eExamAnalysis/userExamInfo',
    method: 'get',
    params: {
      examId: examId
    }
  })
}

/**
 * @description 获得所有考试
 * */
export function getAllExam() {
  return request({
    url: '/eExamAnalysis/getAllExam',
    method: 'post'
  })
}

/**
 * @description: 获得多次考试数据
 * @param {*} studId
 * @return {*}
 */
export function getManyExam(studId) {
  return request({
    url: '/eExamAnalysis/getManyExam',
    method: 'post',
    params: {
      studId
    }
  })
}

/**
 * @description: 获得我的成绩数据
 * @param {*} data
 * @return {*}
 */
export function getMyScoreData(data) {
  data = qs.stringify(data)
  return request({
    url: '/eExamAnalysis/getMyScoreData',
    method: 'post',
    data
  })
}

/**
 * @description: 获得我的成绩数据
 * @param {*} params
 * @return {*}
 */
export function getMyScoreSumData(params) {
  return request({
    url: '/eExamAnalysis/getMyScoreSumData',
    method: 'post',
    params: params
  })
}

/**
 * @description: 获得我的答题卡图片
 * @param {*} data
 * @return {*}
 */
export function getImageInfo(data) {
  data = qs.stringify(data)
  return request({
    url: '/eExamAnalysis/getImageInfo',
    method: 'post',
    data
  })
}

/** *********************************** 知识点分析接口 **********************************/

/**
 * @description: 知识点分析数据 ①
 * @param {*} data: studId,examId,subId
 * @return {*}
 */
export function getKnowTypeAbliDataNew(data) {
  data = qs.stringify(data)
  return request({
    url: '/eExamAnalysis/getKnowTypeAbliDataNew',
    method: 'post',
    data
  })
}

/** *********************************** 试题分析接口（5个接口） **********************************/
/**
 * @description: 试题分析数据 ①
 * @param {*} data: studId,examId,examNo
 * @return {*}
 */
export function getQuesAnalysisData(data) {
  data = qs.stringify(data)
  return request({
    url: '/eExamAnalysis/getQuesAnalysisData',
    method: 'post',
    data
  })
}

/**
 * @description: 试题得分率 ②
 * @param {*} data: studId,examId,subId
 * @return {*}
 */
export function getQuesListMyScoreRate(data) {
  data = qs.stringify(data)
  return request({
    url: '/eExamAnalysis/getQuesListMyScoreRate',
    method: 'post',
    data
  })
}

/**
 * @description: 科目数据 ③
 * @param {*} data: studId, examId, examNo, curSubId
 * @return {*}
 */
export function getSubDataInfo(data) {
  data = qs.stringify(data)
  return request({
    url: '/eExamAnalysis/getSubDataInfo',
    method: 'post',
    data
  })
}

/**
 * @description: 标记的分数据 ④
 * @param {*} data: studId,examId,subId,curClassName
 * @return {*}
 */
export function getQuesMakeScoreNew(data) {
  data = qs.stringify(data)
  return request({
    url: '/eExamAnalysis/getQuesMakeScoreNew',
    method: 'post',
    data
  })
}

/**
 * @description: 正确数据分析 ⑤
 * @param {*} data: studId, examId, subId
 * @return {*}
 */
export function getQuesAnalysisTrueData(data) {
  data = qs.stringify(data)
  return request({
    url: '/eExamAnalysis/getQuesAnalysisTrueData',
    method: 'post',
    data
  })
}

/** *********************************** 提升计划接口（4个接口） **********************************/
/**
 * @description: 提升计划 科目列表 ①
 * @param {*} data: studId, examId, examNo
 * @return {*}
 */
export function getTsjhSubList(data) {
  data = qs.stringify(data)
  return request({
    url: '/eExamAnalysis/getTsjhSubList',
    method: 'post',
    data
  })
}

/**
 * @description: 提升计划 错题类型 ②
 * @param {*} data: examId, paperId
 * @return {*}
 */
export function getWrongQuesTypeByPaperId(data) {
  data = qs.stringify(data)
  return request({
    url: '/eExamAnalysis/getWrongQuesTypeByPaperId',
    method: 'post',
    data
  })
}

/**
 * @description: 提升计划 ③
 * @param {*} data: examId, paperId
 * @return {*}
 */
export function checkGenExerQuesList(data) {
  data = qs.stringify(data)
  return request({
    url: '/eExamAnalysis/checkGenExerQuesList',
    method: 'post',
    data
  })
}

/**
 * @description: 提升计划 ④
 * @param {*} data: examId
 * @return {*}
 */
export function getCurStudPopuInfoByExamId(data) {
  data = qs.stringify(data)
  return request({
    url: '/eExamAnalysis/getCurStudPopuInfoByExamId',
    method: 'post',
    data
  })
}