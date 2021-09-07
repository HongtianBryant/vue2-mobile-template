<!--
 * @Author: your name
 * @Date: 2021-03-04 14:38:41
 * @LastEditTime: 2021-03-10 15:29:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /online-exam/src/views/exam-analysis/knowledge-analysis.vue
-->
<template>
  <div class="page-container">
    <base-scroll ref="contentScroll" class="scroll-wrapper">
      <div class="content-wrapper">
        <van-tabs @change="changeSub">
          <van-tab v-for="sub in subList" :key="sub.subId" :title="sub.subName">
            <div class="data-container">
              <div class="score-cell">
                <div class="block-title" style="width: auto">学科能力分析</div>
                <div class="tip-desc">
                  此结果是根据考试大纲的能力考查要求进行的统计分析。
                </div>
                <div class="content-desc" style="width: auto">
                  你在本次考试中表现出的学科能力如下图所示：
                </div>
                <sub-ability-chart :data="subAbilityData"></sub-ability-chart>
              </div>
              <div class="score-cell">
                <div class="block-title">知识点得分分析</div>
                <div class="legend-tip">
                  <div class="tip-wrapper" style="float: right">
                    <span>我的得分</span>
                    <div class="tip tip1"></div>
                    <span>知识点总分</span>
                    <div class="tip tip2"></div>
                  </div>
                </div>
                <div class="table-wrap">
                  <table class="rate-table">
                    <tbody>
                      <tr v-for="knowRate in knowScoreList" :key="knowRate.id">
                        <td>
                          <div class="know-name">{{ knowRate.knowName }}</div>
                        </td>
                        <td>{{ knowRate.score }}分</td>
                        <td>
                          <div class="percentage">
                            <div
                              class="percentage-bar"
                              :style="{ width: knowRate.percent }"
                            >
                              <span>{{ knowRate.percent }}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="score-cell">
                <div class="block-title">知识点得分率对比</div>
                <div class="chart-wrap">
                  <know-score-compare
                    :data="knowScoreCompareData"
                  ></know-score-compare>
                </div>
                <div class="table-wrap">
                  <table class="know-table">
                    <thead>
                      <tr>
                        <th>知识点</th>
                        <th>我的得分</th>
                        <th>得分率</th>
                        <th>平均得分率</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="know in knowList" :key="know.id">
                        <td class="subName" style="width: 180px">
                          {{ know.knowName }}
                        </td>
                        <td>{{ know.myScore }}</td>
                        <td :style="{ color: know.textColor }">
                          {{ know.scoreRate }}
                        </td>
                        <td>{{ know.avgRate }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="content-desc" v-html="sumKnowDesc"></div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </base-scroll>
  </div>
</template>

<script>
import BaseScroll from '@/components/BaseScroll'
import { getKnowTypeAbliDataNew, getQuesAnalysisData } from '@/api/score-analysis'
import { defaultKnowList } from '@/common/js/default-knows'
import SubAbilityChart from './components/SubAbilityChart.vue'
import KnowScoreCompare from './components/KnowScoreCompare.vue'
import { examInfoMixin } from '@/common/js/mixins'

export default {
  name: 'KnowledgeAnalysis',
  components: {
    BaseScroll,
    SubAbilityChart,
    KnowScoreCompare
  },
  mixins: [examInfoMixin],
  data () {
    return {
      studId: '',
      examNo: '',
      subList: '',
      curClassName: '',
      curSubId: '',
      subAbilityData: {},
      knowScoreList: [],
      knowList: [],
      knowScoreCompareData: {},
      sumKnowDesc: '',
      disAbilityDesc: '',
      abilityDesc: ''
    }
  },
  created () {
    this.initData()
  },
  methods: {
    async initData () {
      const result = await this.apiGetUserExamInfo(this.examId)
      const { success, data } = result
      if (success) {
        this.examNo = data.examNo
        this.studId = data.studId
      }

      const params = {
        studId: this.studId,
        examId: this.examId,
        examNo: this.examNo
      }
      this.apiGetQuesAnalysisData(params).then(res => {
        if (res.success === 'success') {
          const subResult = res.scoreList || []
          if (this.subList.length > 0) {
            this.curClassName = this.subList[0].className
          }
          this.subList = subResult.filter(sub => {
            return sub.subName !== '总分' && !sub.merged
          })
          this.curSubId = this.subList[0].subId
          this.initQuesKnowData(this.curSubId)
        }
      })
    },
    // 切换科目
    changeSub (index) {
      const subId = this.subList[index].subId
      this.initQuesKnowData(subId)
    },
    initQuesKnowData (subId) {
      const params = {
        studId: this.studId,
        examId: this.examId,
        subId: subId
      }
      this.apiGetKnowTypeAbliDataNew(params).then(res => {
        const { success } = res
        if (success) {
          this.showKnowData(res)
        }
      })
    },
    showKnowData (result) {
      const showDatas = result.showDatas
      const quesShowDatas = result.unionshowDatas

      const quesNoArr = []
      const myMakeScore = []
      const myMakeScoreRate = []
      if (quesShowDatas) {
        quesShowDatas.forEach((da) => {
          quesNoArr.push(da[0])
          const quesId = da[1]
          if (result.paperSturesults) {
            result.paperSturesults.forEach((sturesult) => {
              if (quesId === sturesult.quesId) {
                myMakeScore.push(sturesult.quesScore)
                myMakeScoreRate.push(sturesult.scoreRate * 100)
              }
            })
          }
        })
      }

      // 绘制失分汇总的echarts
      this.initLoseScoreEchart(showDatas, quesShowDatas, myMakeScore, myMakeScoreRate, result.knowIdRefsMap)

      // 绘制与最大值相关的数据
      this.initMaxData(showDatas, quesShowDatas, result.knowIdRefsMap, myMakeScoreRate)

      // 能力雷达图
      const oneAbilRateList = result.oneAbilRateList
      const typeNameArr = []
      const mySubScore = []
      const descIds = []
      let minRateId = ''
      let minRateVal = 1
      for (let i = 0; i < oneAbilRateList.length; i++) {
        const scoreRate = oneAbilRateList[i].scoreRate
        const abilName = oneAbilRateList[i].abilName
        const abilId = oneAbilRateList[i].abilId
        typeNameArr.push({
          'name': abilName,
          'max': 100
        })
        mySubScore.push((scoreRate * 100).toFixed(0))
        if (scoreRate < 0.6) {
          descIds.push(abilId)
        }
        if (scoreRate < minRateVal) {
          minRateVal = scoreRate
          minRateId = abilId
        }
      }
      if (typeNameArr.length > 0) {
        this.subAbilityData = {
          typeNameArr: typeNameArr,
          mySubScore: mySubScore
        }
      }

      let html = ''
      let nlHtml = ''
      if (descIds.length > 0) {
        for (let i = 0; i < descIds.length; i++) {
          const abiliId = descIds[i]
          let name = ''
          let desc = ''
          for (let j = 0; j < defaultKnowList.length; j++) {
            if (defaultKnowList[j][0] === abiliId) {
              name = defaultKnowList[j][2]
              desc = defaultKnowList[j][3]
              break
            }
          }// <p style='color: #6dd5fa;'>"+name+"</p>
          if (nlHtml !== '') {
            nlHtml += '、'
          }
          nlHtml += `<span style='color: #6dd5fa;'>${name}</span>`
          html += `<p><span style='color: #6dd5fa;'>${name}</span>${desc}</p>`
        }
      } else {
        let name = ''
        let desc = ''
        for (let j = 0; j < defaultKnowList.length; j++) {
          if (defaultKnowList[j][0] === minRateId) {
            name = defaultKnowList[j][2]
            desc = defaultKnowList[j][3]
            break
          }
        }
        nlHtml += `<span style='color: #6dd5fa;'>${name}</span>`
        html += `<p><span style='color: #6dd5fa;'>${name}</span>${desc}</p>`
      }
      this.disAbilityDesc = nlHtml
      this.abilityDesc = html

      this.refreshScroll()
    },
    initLoseScoreEchart (showDatas, quesShowDatas, myMakeScore, myMakeScoreRate, knowIdRefsMap) {
      if (!showDatas) {
        return false
      }

      this.knowScoreList = []
      this.knowList = []
      for (let s = 0; s < showDatas.length; s++) {
        const knowId = showDatas[s][4]
        if (knowIdRefsMap) {
          if (Object.prototype.hasOwnProperty.call(knowIdRefsMap, knowId)) {
            const knowQuesArr = knowIdRefsMap[knowId] // 知识点对应的题，可能是多个
            let myAllSR = 0
            let myKnow = 0
            for (let k = 0; k < knowQuesArr.length; k++) {
              const quesId = knowQuesArr[k].quesId
              for (let q = 0; q < quesShowDatas.length; q++) {
                if (quesId === quesShowDatas[q][1]) {
                  myAllSR += myMakeScoreRate[q] || 0
                  myKnow += myMakeScore[q] || 0
                }
              }
            }

            const c = s + 1
            const percent = (parseFloat(myAllSR / knowQuesArr.length)).toFixed(0) + '%'

            const randomNum = parseInt((c + Math.random()) * 65536)
            this.knowScoreList.push({
              id: randomNum,
              knowName: c + '.' + showDatas[s][0],
              score: showDatas[s][1],
              percent: percent
            })

            let textColor = ''
            const avgRate = (parseFloat(showDatas[s][3]) * 100).toFixed(0)
            const myRate = (myAllSR / knowQuesArr.length).toFixed(0)
            if (myRate < avgRate) {
              textColor = '#ff7f6a'
            } else if (myRate > avgRate) {
              textColor = '#adce66'
            } else if (myRate === avgRate) {
              textColor = '#ffc300'
            }
            let pVal = myAllSR / knowQuesArr.length
            if (knowQuesArr && knowQuesArr.length === 0) {
              pVal = 0
            }

            this.knowList.push({
              id: randomNum,
              knowName: showDatas[s][0],
              myScore: myKnow,
              scoreRate: pVal.toFixed(0) + '%',
              avgRate: (parseFloat(showDatas[s][3]) * 100).toFixed(0) + '%',
              textColor: textColor
            })
          }
        }
      }
    },
    initMaxData (showDatas, quesShowDatas, knowIdRefsMap, myMakeScoreRate) {
      if (!showDatas) {
        return false
      }
      const knowNameArr = []
      const knowAvgScore = []
      const myKnowRate = []
      let fullScoreNum = 0
      const lessKnowArr = []
      let zeroScoreNum = 0
      for (let s = 0; s < showDatas.length; s++) {
        const avgScoreRateVal = (parseFloat(showDatas[s][3]) * 100).toFixed(2)
        knowNameArr.push(showDatas[s][0])
        knowAvgScore.push(avgScoreRateVal)
        const knowId = showDatas[s][4]
        if (knowIdRefsMap) {
          if (Object.prototype.hasOwnProperty.call(knowIdRefsMap, knowId)) {
            const knowQuesArr = knowIdRefsMap[knowId]// 知识点对应的题，可能是多个
            let myAllSR = 0
            for (let k = 0; k < knowQuesArr.length; k++) {
              const quesId = knowQuesArr[k].quesId
              for (let q = 0; q < quesShowDatas.length; q++) {
                if (quesId === quesShowDatas[q][1]) {
                  myAllSR += myMakeScoreRate[q]
                }
              }
            }
            const myKnowRateVal = (myAllSR / knowQuesArr.length).toFixed(2)
            myKnowRate.push(myKnowRateVal)
            if (Number(myKnowRateVal) === 100) {
              fullScoreNum++
            }
            if (Number(avgScoreRateVal) > Number(myKnowRateVal)) {
              lessKnowArr.push(showDatas[s][0])
            }
            if (myKnowRateVal == 0) {
              zeroScoreNum++
            }
          }
        }
      }

      let knowDescHtml = `<p>本次考试考察的知识点共<span style='color: #ff7f6a;'>${knowNameArr.length}</span>个`
      if (fullScoreNum > 0) {
        knowDescHtml += `，你获得满分的知识点<span style='color: #ff7f6a;'>${fullScoreNum}</span>个`
      }
      if (zeroScoreNum > 0) {
        knowDescHtml += `，未得分的知识点<span style='color: #ff7f6a;'>${zeroScoreNum}</span>个`
      }
      if (lessKnowArr.length > 0) {
        knowDescHtml += `，以下知识点低于平均水平：<span style='color: #ff7f6a;'>${lessKnowArr.join('、')}</span>`
      }
      knowDescHtml += '。</p>'
      this.sumKnowDesc = knowDescHtml

      this.knowScoreCompareData = {
        knowNameArr: knowNameArr,
        knowAvgScore: knowAvgScore,
        myKnowRate: myKnowRate
      }
    },
    refreshScroll () {
      this.$nextTick(() => {
        this.$refs.contentScroll.refresh()
      })
    },
    apiGetKnowTypeAbliDataNew (data) {
      return new Promise((resolve, reject) => {
        getKnowTypeAbliDataNew(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetQuesAnalysisData (data) {
      return new Promise((resolve, reject) => {
        getQuesAnalysisData(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-wrapper {
  height: calc(100vh - 80px);
  overflow: hidden;
}
.legend-tip {
  width: 100%;
  margin: 15px 0;
  padding: 10px 15px;
  font-size: 12px;
  color: #8d99a6;
  .tip {
    display: inline-block;
    vertical-align: top;
    width: 20px;
    height: 10px;
    margin: 0 5px 0 5px;
    border-radius: 5px;
    &.tip1 {
      background-color: #6dd5fa;
    }
    &.tip2 {
      background-color: #fd9f8e;
    }
  }
}
.content-wrapper {
  .block-title {
    width: 100%;
    padding: 5px 15px;
    font-size: 16px;
    color: #6dd5fa;
    &::before {
      content: "";
      border-left: 4px solid #6dd5fa;
      margin-right: 8px;
    }
    .tip-explain {
      float: right;
      display: block;
      // background: url(/static2/images/icon/icon-explain.png) no-repeat center;
      width: 24px;
      height: 24px;
      background-size: 18px 18px;
    }
  }
  .tip-desc {
    position: relative;
    font-size: 12px;
    color: #b6bec8;
    margin: 10px 15px;
    width: 100%;
  }
  .score-cell {
    position: relative;
    background-color: #fff;
    padding: 10px 0 20px;
    margin-bottom: 15px;
  }
  .exam-select {
    position: relative;
    width: 100%;
    color: #6dd5fa;
    text-align: center;
    width: 80%;
    font-size: 16px;
    height: 25px;
    line-height: 25px;
    margin: 5px auto 15px;
  }
  .content-desc {
    font-size: 14px;
    color: #656d7d;
    margin: 10px 15px;
    text-align: justify;
    .value-text {
      color: #6dd5fa;
    }
  }
}
.know-table {
  border-collapse: collapse;
  margin: 15px 0;
  text-align: center;
  width: 100%;
  font-size: 12px;
  border-bottom: 1px solid #6dd5fa;
  thead th {
    color: #ff7f6a;
    font-size: 12px;
    &:first-child {
      text-align: left;
      padding-left: 14px;
    }
  }
  tbody tr {
    border-top: 1px solid #6dd5fa;
    height: 32px;
    &:nth-child(odd) {
      background-color: #e2f7fe;
    }
    td {
      color: #656d7d;
      font-size: 14px;
      // border-left: 1px solid #91e0f9;
      &:first-child {
        text-align: left;
        padding-left: 14px;
        color: #858d9d;
        font-weight: 400;
        border-left: 0;
      }
    }
  }
}
.percentage {
  position: relative;
  height: 12px;
  background-color: #fd9f8e;
  width: 100%;
  border-radius: 6px;
  .percentage-bar {
    float: left;
    width: 0;
    height: 100%;
    font-size: 12px;
    color: #fff;
    text-align: center;
    background-color: #6dd5fa;
    border-radius: 6px;
    span {
      position: absolute;
      left: 10px;
      top: 0;
      color: #fff;
      font-size: 12px;
      line-height: 12px;
    }
  }
}
.rate-table {
  width: 100%;
  text-align: center;
  font-size: 12px;
  padding: 0 10px;
  color: #989697;
  td:first-child {
    width: 48%;
  }
  td:nth-child(2) {
    width: 40px;
  }
  .know-name {
    text-align: left;
    width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
::v-deep .van-tabs__wrap {
  border-bottom: 1px solid #d4dae6;
}
</style>
