<template>
  <div class="page-container">
    <base-scroll ref="contentScroll" class="scroll-wrapper">
      <div class="content-wrapper">
        <van-tabs @change="changeSub">
          <van-tab v-for="sub in subList" :key="sub.subId" :title="sub.subName">
            <div class="sub-data-container">
              <div class="score-cell">
                <div class="content-desc" style="margin-bottom: 20px;">
                  你的<span class="value-text">{{ curSubName }}</span>
                  科目成绩是<span class="value-text">{{ curSubScore }}</span>分，在班级、年级和联校中成绩如下图所示：
                </div>
                <score-distribute-chart :data="distributeChartData"></score-distribute-chart>
              </div>
              <div class="score-cell">
                <div class="block-title">试题难度分析</div>
                <div class="content-desc">本次考试试卷整体难度为
                  <a class="value-text">{{ unionDiffNum }}</a>。
                </div>
                <div class="tip-desc">
                  <div style="float: right">
                    <p>外环：整卷各难度题目占比</p>
                    <p>内环：各难度错题数量</p>
                  </div>
                </div>
                <ques-difficult-chart :data="quesDifficultChartData"></ques-difficult-chart>
                <div class="content-desc" style="margin-bottom: 0;">
                  根据错题情况分析:
                </div>
                <div class="content-desc" v-html="wrongQuesDesc"></div>
              </div>
              <div class="score-cell">
                <div class="block-title">小题得分分析</div>
                <div class="content-desc">需注意低于平均得分率的小题</div>
                <per-ques-score :data="perQuesScoreChartData"></per-ques-score>
                <div class="content-desc" style="margin-bottom: 0;">分析结果显示：</div>
                <div class="content-desc" v-html="littleQuesDesc"></div>
                <div class="table-wrap">
                  <table class="know-table">
                    <thead>
                      <tr>
                        <th style="width: 12%">题号</th>
                        <th style="width: 30%">知识点</th>
                        <th style="width: 12%">难度</th>
                        <th style="width: 11%">分值</th>
                        <th style="width: 11%">得分</th>
                        <th style="width: 12%">得分率</th>
                        <th style="width: 12%">解析</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="scoreRateQues in makeScoreRateDetail" :key="scoreRateQues.quesId">
                        <td>{{ scoreRateQues.quesNo }}</td>
                        <td>{{ scoreRateQues.knowNames }}</td>
                        <td>{{ scoreRateQues.difficult }}</td>
                        <td>{{ scoreRateQues.score }}</td>
                        <td>{{ scoreRateQues.myScore }}</td>
                        <td :style="{color: scoreRateQues.curColor}">{{ scoreRateQues.scoreRate }}</td>
                        <td><a>解析</a></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="score-cell">
                <div class="block-title">题型得分分析</div>
                <div class="tip-desc">将综合性试题进行多维度分解可以看出自身的学习缺失以便于接下来的复习规划制定更有针对性的对策。</div>
                <div class="legend-tip">
                  <div class="tip-wrapper" style="float: right;">
                    <span>我的得分</span>
                    <div class="tip tip1"></div>
                    <span>题型总分</span>
                    <div class="tip tip2"></div>
                  </div>
                </div>
                <table id="typeScoreRate" class="know-table" style="margin-top: 5px;">
                  <thead>
                    <tr>
                      <th style="width: 20%;">题型</th>
                      <th style="width: 20%;">题型总分</th>
                      <th style="width: 60%;">得分占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(ques, index) in scoreRateTableData" :key="index">
                      <td><div class="typeName">{{ ques.quesType }}</div></td>
                      <td>{{ ques.scoreTotal }}分</td>
                      <td>
                        <div class="percentage">
                          <div class="percentage-bar" :style="{width: ques.percent}">
                            <span>{{ ques.quesScore }}分</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="score-cell">
                <div class="block-title">客观题错误分析</div>
                <div class="tip-desc">根据选项的分布和错项的人数多少，可以发现错误是否具有普遍性，对于普遍性的错误，可以重点寻求错误原因。</div>
                <table class="know-table">
                  <thead>
                    <tr>
                      <th>题号</th>
                      <th>我的答案</th>
                      <th>正确答案</th>
                      <th>正确率</th>
                      <th>错项分布</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="wrongQues in wrongQuesTable" :key="wrongQues.quesId">
                      <td>{{ wrongQues.quesNo }}</td>
                      <td>{{ wrongQues.myChoice }}</td>
                      <td>{{ wrongQues.rightAnswer }}</td>
                      <td style="padding: 10px 0">
                        <van-circle
                          v-model="wrongQues.rightPercent"
                          layer-color="#d3dae5"
                          color="#6cd6f9"
                          :rate="30"
                          :size="60"
                          :speed="100"
                          :stroke-width="120"
                          :text="wrongQues.percentText"
                        ></van-circle>
                      </td>
                      <td>
                        <div v-for="(choice, index) in wrongQues.choiceArr" :key="index" class="choice-item">
                          <div class="text" :style="{color: choice.color}">{{ choice.choiceT }}</div>
                          <div class="progress-wrap">
                            <van-progress
                              :show-pivot="false"
                              :color="choice.color"
                              :percentage="choice.width"
                              stroke-width="10"
                            ></van-progress>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
import { getQuesAnalysisData, getQuesListMyScoreRate, getSubDataInfo, getQuesMakeScoreNew, getQuesAnalysisTrueData } from '@/api/score-analysis'
import ScoreDistributeChart from './components/ScoreDistributeChart.vue'
import QuesDifficultChart from './components/QuesDifficultChart.vue'
import '@/styles/analysis.scss'
import PerQuesScore from './components/PerQuesScore.vue'
import { examInfoMixin } from '@/common/js/mixins'

export default {
  name: 'QuesAnalysis',
  components: {
    BaseScroll,
    ScoreDistributeChart,
    QuesDifficultChart,
    PerQuesScore
  },
  mixins: [examInfoMixin],
  data() {
    return {
      studId: '',
      examNo: '',
      schoName: '',
      subList: [], // 科目数组
      curClassName: '',
      curSubId: '',
      curSubName: '',
      curSubScore: 0,
      distributeChartData: undefined,
      scoreRateTableData: [],
      quesDifficultChartData: undefined,
      wrongQuesDesc: '',
      unionDiffNum: '', // 联校难度值
      makeScoreRateDetail: [],
      perQuesScoreChartData: undefined,
      littleQuesDesc: '',
      wrongQuesTable: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      const result = await this.apiGetUserExamInfo(this.examId)
      const { success, data } = result
      if (success) {
        this.examNo = data.examNo
        this.studId = data.studId
      }
      this.initialSubjects()
    },
    initialSubjects() {
      const params = {
        studId: this.studId,
        examId: this.examId,
        examNo: this.examNo
      }
      this.apiGetQuesAnalysisData(params).then(res => {
        const { success } = res
        if (success) {
          const scoreList = res.scoreList || []
          if (scoreList.length !== 0) {
            scoreList.forEach((score, index) => {
              if (index === 0) {
                this.curClassName = score.className
              }
              const sub = {
                subId: score.subId,
                subName: score.subName,
                merged: score.merged
              }
              if (score.subName !== '总分' && !score.merged) {
                this.subList.push(sub)
              }
            })
            this.curSubId = this.subList[0].subId
            this.curSubName = this.subList[0].subName
            this.initDataBySub(this.curSubId)
          }
        }
      })
    },
    // 切换科目
    changeSub(index) {
      const subId = this.subList[index].subId
      this.curSubName = this.subList[index].subName
      this.initDataBySub(subId)
    },
    // 根据科目切换 获得当前科目当前数据
    initDataBySub(subId) {
      this.initSubDataInfo(subId)
      this.initScoreRateBySub(subId)
      this.initMarkScore(subId)
    },
    // 初始化科目数据信息
    initSubDataInfo(subId) {
      const params = {
        studId: this.studId,
        examId: this.examId,
        examNo: this.examNo,
        curSubId: subId
      }
      this.apiGetSubDataInfo(params).then(result => {
        const { success } = result
        if (success) {
          const examScore = result.examScore ? result.examScore : 0 // 我的得分
          const classMax = result.classMax ? result.classMax : 0 // 班级最高分
          const classMin = result.classMin ? result.classMin : 0 // 班级最低分
          const classAvg = result.classAvg ? result.classAvg : 0 // 班级平均分
          const schoolMax = result.schoolMax ? result.schoolMax : 0 // 学校最高分
          const schoolMin = result.schoolMin ? result.schoolMin : 0 // 学校最低分
          const schoolAvg = result.schoolAvg ? result.schoolAvg : 0 // 学校平均分
          const unionMax = result.unionMax ? result.unionMax : 0 // 联校最高分
          const unionMin = result.unionMin ? result.unionMin : 0 // 联校最低分
          const unionAvg = result.unionAvg ? result.unionAvg : 0 // 联校平均分
          const fullScore = result.fullScore ? result.fullScore : 0 // 当前科目满分

          this.curSubScore = examScore
          const arrMin = [classMin, schoolMin, unionMin]
          const arrRealMax = [classMax, schoolMax, unionMax]
          const arrMax = [classMax - classMin, schoolMax - schoolMin, unionMax - unionMin]
          const arrAvg = [classAvg, schoolAvg, unionAvg]
          const arrFull = [fullScore, fullScore, fullScore]
          this.distributeChartData = {
            arrMin,
            arrMax,
            arrAvg,
            arrFull,
            arrRealMax,
            examScore
          }
        }
      })
    },
    // 初始化得分率
    initScoreRateBySub(subId) {
      const params = {
        studId: this.studId,
        examId: this.examId,
        subId: subId
      }
      this.apiGetQuesListMyScoreRate(params).then(res => {
        const { success, scoreQTypeList } = res
        if (success) {
          this.scoreRateTableData = []
          for (const score of scoreQTypeList) {
            const quesScore = score.quesScore || 0
            const scoreTotal = score.scoreTotal
            const percent = ((quesScore / scoreTotal) * 100).toFixed(0) + '%'
            if (scoreTotal) {
              this.scoreRateTableData.push({
                quesType: score.quesType,
                scoreTotal: score.scoreTotal,
                percent: percent,
                quesScore: quesScore
              })
            }
          }
        }
      })
    },
    // 答题结果数据
    initMarkScore(subId) {
      const params = {
        studId: this.studId,
        examId: this.examId,
        subId: subId,
        curClassName: this.curClassName
      }
      this.apiGetQuesMakeScoreNew(params).then(res => {
        const { success } = res
        if (success) {
          this.initMakeScoreEchart(subId, res)
        }
      })
    },
    initMakeScoreEchart(subId, result) {
      const showDatas = result.unionshowDatas
      const unionMakeScoreMap = result.unionScoreRate
      const schoolMakeScoreMap = result.schoolScoreRate
      showDatas.sort((x, y) => {
        if (parseInt(x[0]) < parseInt(y[0])) {
          return -1
        } else if (parseInt(x[0]) > parseInt(y[0])) {
          return 1
        } else {
          return 0
        }
      })

      const questionsList = result.questionsList

      const quesNoMap = {}
      const myMakeScore = []
      const myMakeScoreRate = []
      const quesKnowNameArr = []
      const quesAnswerArr = []
      const paperIdArr = []
      const myChoice = []

      // 绘制错误原因分析表格
      for (const quesInfo of showDatas) {
        const quesId = quesInfo[1]
        const uuid = quesInfo[3]
        const quesNo = quesInfo[0] || ''
        quesNoMap[uuid] = quesNo
        const paperSturesults = result.paperSturesults
        if (result.paperSturesults) {
          let hasScore = false
          paperSturesults.map((sturesult) => {
            if (quesId === sturesult.quesId) {
              myMakeScore.push(sturesult.quesScore)
              const scoreRate = sturesult.scoreRate ? sturesult.scoreRate : 0
              myMakeScoreRate.push((scoreRate * 100).toFixed(0))
              hasScore = true
              quesKnowNameArr.push(sturesult.knowNames)
              quesAnswerArr.push(sturesult.answer ? sturesult.answer : '')
              paperIdArr.push(sturesult.paperId)
              if (sturesult.answer == null) {
                myChoice.push('')
              } else {
                myChoice.push(sturesult.answer)
              }
            }
          })
          if (!hasScore) {
            myMakeScore.push(0)
            myMakeScoreRate.push(0)
            quesKnowNameArr.push('-')
          }
        }
      }

      this.makeScoreRateDetail = []
      const easyNoArr = []
      const midNoArr = []
      const hardNoArr = []

      let lessAvgNum = 0
      let betterAvgNum = 0
      let myTotalScoreB = 0
      let myTotalScoreL = 0
      let lessTotalScore = 0
      let betterTotalScore = 0
      for (let t = 0; t < showDatas.length; t++) {
        const genId = showDatas[t][3]
        let myColor = ''
        if (parseInt(myMakeScoreRate[t]) < parseInt(unionMakeScoreMap[genId])) {
          myColor = '#ff7f6a'
          lessAvgNum++
          lessTotalScore = lessTotalScore + parseInt(showDatas[t][2])
          myTotalScoreL += parseInt(myMakeScore[t])
        } else {
          myColor = ''
          betterAvgNum++
          betterTotalScore = betterTotalScore + parseInt(showDatas[t][2])
          myTotalScoreB += parseInt(myMakeScore[t])
        }

        if (myMakeScoreRate[t] === 0) {
          myColor = '#ff7f6a'
        }

        const difficult = ((unionMakeScoreMap[genId] / 100) ? (unionMakeScoreMap[genId] / 100) : 1).toFixed(2)
        let diffText = ''
        if (difficult >= 0 && difficult < 0.4) {
          diffText = '困难'
        } else if (difficult >= 0.4 && difficult < 0.7) {
          diffText = '中等'
        } else if (difficult >= 0.7 && difficult <= 1) {
          diffText = '简单'
        }

        this.makeScoreRateDetail.push({
          quesNo: showDatas[t][0],
          knowNames: quesKnowNameArr[t] || '-',
          difficult: diffText,
          score: showDatas[t][2],
          myScore: myMakeScore[t] || '-',
          scoreRate: myMakeScoreRate[t] + '%',
          paperId: paperIdArr[t],
          geneId: genId,
          quesId: showDatas[t][1],
          myAnswer: quesAnswerArr[t],
          curColor: myColor
        })

        // 计算错题情况
        if (myMakeScoreRate[t] && myMakeScoreRate[t] < 100) {
          if (difficult >= 0 && difficult < 0.4) {
            hardNoArr.push(showDatas[t][0])
          } else if (difficult >= 0.4 && difficult < 0.7) {
            midNoArr.push(showDatas[t][0])
          } else if (difficult >= 0.7 && difficult <= 1) {
            easyNoArr.push(showDatas[t][0])
          }
        }

        let html = ''
        if (easyNoArr.length > 0) {
          html += "<p>第<span class='ques-no'>" + easyNoArr.join('、') + '</span>题为简单题，该部分试题不应该失分，需要熟练掌握。</p>'
        }
        if (midNoArr.length > 0) {
          html += "<p>第<span class='ques-no'>" + midNoArr.join('、') + '</span>题为难度适中的题目，该部分试题需要加强巩固练习，避免下次失分。</p>'
        }
        if (hardNoArr.length > 0) {
          html += "<p>第<span class='ques-no'>" + hardNoArr.join('、') + '</span>题虽然是偏难题，但是这些题目低于平均得分，通过加强针对性训练是可以完全掌握的！</p>'
        }
        this.wrongQuesDesc = html
      }

      const wrongNumArr = [easyNoArr.length, midNoArr.length, hardNoArr.length]
      // 整卷难度分布的echart
      const unionMakeScoreRate = []
      for (const key in unionMakeScoreMap) {
        unionMakeScoreRate.push(unionMakeScoreMap[key])
      }
      // 显示难度分析饼图
      this.initDiffDistributeEchart(unionMakeScoreRate, wrongNumArr)

      let littleHtml = ''
      if (lessAvgNum === 0) {
        const percent = (myTotalScoreB / betterTotalScore) * 100 ? (myTotalScoreB / betterTotalScore) * 100 : 0
        littleHtml += "<p>你所有试题均高于联校平均得分率，占<span class='val'>" + myTotalScoreB + "</span>分、<span class='val'>" + percent.toFixed(0) + '%</span>。</p>'
      } else if (betterAvgNum === 0) {
        const percent = (myTotalScoreL / lessTotalScore) * 100 ? (myTotalScoreL / lessTotalScore) * 100 : 0
        littleHtml += `<p>你所有试题均高于联校平均得分率，占<span class='val'>${myTotalScoreL}</span>分、<span class='val'>${percent.toFixed(0)}%</span>。</p>`
      } else {
        const percent1 = (myTotalScoreL / lessTotalScore) * 100 ? (myTotalScoreL / lessTotalScore) * 100 : 0
        littleHtml += `<p>共有<span class='val'>${lessAvgNum}</span>道试题低于联校平均得分率，占<span class='val'>${myTotalScoreL}</span>分、<span class='val'>${percent1.toFixed(0)}%</span>。</p>`

        const percent2 = (myTotalScoreB / betterTotalScore) * 100 ? (myTotalScoreB / betterTotalScore) * 100 : 0
        littleHtml += `<p>共有<span class='val'>${betterAvgNum}</span>道试题高于联校平均得分率，占<span class='val'>${myTotalScoreB}</span>分、<span class='val'>${percent2.toFixed(0)}%</span>。</p>`
      }
      this.littleQuesDesc = littleHtml
      // $('#little_ques_desc').html(littleHtml)

      // 绘制客观题数据
      // initObjectData(showDatas,myChoice,showDatasCla,unionMakeScoreRate,schoolMakeScoreRate,result.questionsList);
      //
      const quesNoArr = []
      const unionMakeScoreRateList = []
      const schoolMakeScoreRate = []
      for (const gen in quesNoMap) {
        quesNoArr.push(quesNoMap[gen])
        const rate = unionMakeScoreMap[gen] || 0
        const srate = schoolMakeScoreMap[gen] || 0
        unionMakeScoreRateList.push(rate)
        schoolMakeScoreRate.push(srate)
      }
      this.perQuesScoreChartData = {
        quesNoArr: quesNoArr,
        unionMakeScoreRate: unionMakeScoreRateList,
        schoolMakeScoreRate: schoolMakeScoreRate,
        myMakeScoreRate: myMakeScoreRate
      }

      this.refreshScroll()
      this.initWrongReasonData(showDatas, myChoice, questionsList, myMakeScoreRate, subId)
    },
    initDiffDistributeEchart(unionMakeScoreRate, wrongNumArr) {
      let easyNum = 0
      let commonNum = 0
      let hardNum = 0
      let sumDiff = 0
      for (let i = 0; i < unionMakeScoreRate.length; i++) {
        if (parseInt(unionMakeScoreRate[i]) < 40) {
          hardNum++
        } else if (parseInt(unionMakeScoreRate[i]) < 65) {
          commonNum++
        } else {
          easyNum++
        }
        sumDiff += parseInt(unionMakeScoreRate[i])
      }
      const avgDiff = sumDiff / unionMakeScoreRate.length

      this.unionDiffNum = (avgDiff / 100).toFixed(2)

      const data = {
        id: 'echartPie',
        value: [easyNum, commonNum, hardNum],
        legend: ['简单题', '中等题', '难题'],
        color: ['#f8c848', '#81c8fe', '#ee6969']
      }

      const seriesData = []
      data.value.forEach(function(item, index) {
        seriesData.push({
          value: item,
          name: data.legend[index]
        })
      })
      this.quesDifficultChartData = {
        data,
        seriesData,
        wrongNumArr
      }
    },
    initWrongReasonData(showDatas, myChoice, questionsList, myMakeScoreRate, subId) {
      const params = {
        studId: this.studId,
        examId: this.examId,
        subId: subId
      }
      this.apiGetQuesAnalysisTrueData(params).then(res => {
        this.wrongReasonData(showDatas, myChoice, questionsList, myMakeScoreRate, res)
      })
    },
    wrongReasonData(showDatas, myChoice, questionsList, myMakeScoreRate, result) {
      const trueRateMap = result.trueRateMap
      const quesIdChoiceRateMap = result.quesIdChoiceRateMap

      const objectType = ['单选题', '多选题', '判断题', '听力']
      const choiceArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'PT', 'PF']
      const choiceColorArr = ['#6cd6f9', '#f5cc3f', '#cee89a', '#85e0d2', '#edc38c', '#946c39', '#a59989', '#e2d2bc', '#9d671c']
      const reg = new RegExp('<p>', 'g')
      const reg2 = new RegExp('</p>', 'g')
      const reg3 = new RegExp('<br>', 'g')
      const reg4 = new RegExp('<br/>', 'g')
      let count = 0
      this.wrongQuesTable = []
      for (let i = 0; i < showDatas.length; i++) {
        let bgcolor = 'transparent'
        if (count % 2 === 0) {
          bgcolor = '#e2f8fe'
        }

        const quesId = showDatas[i][1]
        let quesAnswer = ''
        const quesNo = showDatas[i][0]
        for (let t = 0; t < questionsList.length; t++) {
          const ques = questionsList[t]
          const index = objectType.findIndex(item => {
            return item === ques.quesType
          })
          if (quesId === ques.id && index !== -1) {
            quesAnswer = ques.quesAnswer.replace(reg, '').replace(reg2, '').replace(reg3, '').replace(reg4, '')
            if (myMakeScoreRate[i] < 100) {
              let rightPercent = 0
              if (Object.prototype.hasOwnProperty.call(trueRateMap, quesId)) {
                let rate = trueRateMap[quesId].replace('%', '')
                if (rate === '-') {
                  rate = 0
                }
                rightPercent = parseInt(rate)
              }
              this.wrongQuesTable.push({
                quesNo: quesNo,
                myChoice: myChoice[i],
                rightAnswer: quesAnswer,
                rightPercent: rightPercent,
                percentText: rightPercent + '%',
                choiceArr: this.getWrongChoiceHtml(quesIdChoiceRateMap, quesId, choiceArr, choiceColorArr, quesAnswer)
              })
              count++
            }
          }
        }
      }
      this.refreshScroll()
    },
    getWrongChoiceHtml(quesIdChoiceRateMap, quesId, choiceArr, choiceColorArr, quesAnswer) {
      const retArr = []
      if (Object.prototype.hasOwnProperty.call(quesIdChoiceRateMap, quesId)) {
        const curQuesMap = quesIdChoiceRateMap[quesId]
        const valArr = []
        const valColorArr = []
        const wrongNum = []
        for (let c = 0; c < choiceArr.length; c++) {
          if (Object.prototype.hasOwnProperty.call(curQuesMap, choiceArr[c])) {
            valArr.push(curQuesMap[choiceArr[c]])
            valColorArr.push(choiceColorArr[c])
            if (quesAnswer !== choiceArr[c]) {
              wrongNum.push(curQuesMap[choiceArr[c]][0])
            }
          }
        }
        let allNumQues = 0
        for (let q = 0; q < wrongNum.length; q++) {
          allNumQues += parseInt(wrongNum[q])
        }
        let co = 0
        for (let c = 0; c < choiceArr.length; c++) {
          if (Object.prototype.hasOwnProperty.call(curQuesMap, choiceArr[c])) {
            valArr.push(curQuesMap[choiceArr[c]])
            valColorArr.push(choiceColorArr[c])
            if (quesAnswer !== choiceArr[c]) {
              const width = parseInt(wrongNum[co] / allNumQues * 60)
              retArr.push({
                color: choiceColorArr[c],
                choiceT: choiceArr[c],
                width: width
              })
              co++
            }
          }
        }
      }
      return retArr
    },
    unionScoreGetRate(result) {
      // ---start 联校得分率计算
      const showDatas = result.unionshowDatas
      const unionMakeScoreRate = result.unionScoreRate
      const schoolMakeScoreRate = result.schoolScoreRate
      showDatas.sort((x, y) => {
        if (parseInt(x[0]) < parseInt(y[0])) {
          return -1
        } else if (parseInt(x[0]) > parseInt(y[0])) {
          return 1
        } else {
          return 0
        }
      }) // 按题号排序
      return [showDatas, unionMakeScoreRate, schoolMakeScoreRate]
    },
    compare(x, y) { // 比较函数
      if (parseInt(x[0]) < parseInt(y[0])) {
        return -1
      } else if (parseInt(x[0]) > parseInt(y[0])) {
        return 1
      } else {
        return 0
      }
    },
    refreshScroll() {
      this.$nextTick(() => {
        this.$refs.contentScroll.refresh()
      })
    },
    apiGetQuesAnalysisData(data) {
      return new Promise((resolve, reject) => {
        getQuesAnalysisData(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetQuesListMyScoreRate(data) {
      return new Promise((resolve, reject) => {
        getQuesListMyScoreRate(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetSubDataInfo(data) {
      return new Promise((resolve, reject) => {
        getSubDataInfo(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetQuesMakeScoreNew(data) {
      return new Promise((resolve, reject) => {
        getQuesMakeScoreNew(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetQuesAnalysisTrueData(data) {
      return new Promise((resolve, reject) => {
        getQuesAnalysisTrueData(data).then(res => {
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
.scroll-wrapper{
  height: calc(100vh - 80px);
  overflow: hidden;
}
.content-wrapper{
  .block-title{
    width: 100%;
    padding: 5px 15px;
    font-size: 16px;
    color: #6dd5fa;
    &::before{
      content: '';
      border-left: 4px solid #6dd5fa;
      margin-right: 8px;
    }
    .tip-explain{
      float: right;
      display: block;
      // background: url(/static2/images/icon/icon-explain.png) no-repeat center;
      width: 24px;
      height: 24px;
      background-size: 18px 18px;
    }
  }
  .tip-desc{
    position: relative;
    font-size: 12px;
    color: #b6bec8;
    margin: 10px 15px;
    width: 100%;
  }
  .score-cell{
    position: relative;
    background-color: #fff;
    padding: 10px 0 20px;
    margin-bottom: 15px;
  }
  .exam-select{
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
  .content-desc{
    font-size: 14px;
    color: #656d7d;
    margin: 10px 15px;
    text-align: justify;
    .value-text{
      color: #6dd5fa;
    }
  }
}

.know-table{
  border-collapse: collapse;
  margin: 15px 0;
  text-align: center;
  width: 100%;
  font-size: 12px;
  border-bottom: 1px solid #6dd5fa;
  thead th{
    color: #ff7f6a;
    font-size: 12px;
    &:first-child{
      text-align: left;
      padding-left: 14px;
    }
  }
  tbody tr{
    border-top: 1px solid #6dd5fa;
    height: 32px;
    &:nth-child(odd){
      background-color: #e2f7fe;
    }
    td{
      color: #656d7d;
      font-size: 14px;
      border-left: 1px solid #91e0f9;
      &:first-child{
        text-align: left;
        padding-left: 14px;
        color: #858d9d;
        font-weight: 400;
        border-left: 0;
      }
    }
  }
}
.legend-tip{
  width: 100%;
  margin-top: 15px;
  padding: 0 15px;
  font-size: 12px;
  color: #8d99a6;
  .tip {
    display: inline-block;
    vertical-align: top;
    width: 20px;
    height: 10px;
    margin: 0 5px;
    border-radius: 5px;
    &.tip1{
      background-color: #6dd5fa;
    }
    &.tip2{
      background-color: #fd9f8e;
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
    span{
      position: absolute;
      left: 10px;
      top: 0;
      color: #fff;
      font-size: 12px;
      line-height: 12px;
    }
  }
}

.choice-item{
  display: flex;
  align-items: center;
  .text{
    width: 10px;
    flex: 0 0 10px;
  }
  .progress-wrap{
    flex: 1;
    margin-left: 5px;
    ::v-deep .van-progress{
      border-radius: 0;
    }
  }
}
::v-deep .van-tabs__wrap{
  border-bottom: 1px solid #d4dae6;
}
</style>
