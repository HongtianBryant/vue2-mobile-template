<template>
  <div class="page-container">
    <base-scroll ref="contentScroll" class="scroll-wrapper">
      <div class="content-wrapper">
        <div class="score-cell">
          <div class="exam-select" @click="showExamPicker">
            {{ studExam.exam.examName }}
            <van-icon name="arrow-down"></van-icon>
          </div>
          <van-row>
            <van-col span="12">
              <div class="stud-info">
                <div class="hb-name">
                  <i class="tip"></i>
                  <span class="name">总分成绩</span>
                </div>
                <div class="value">{{ studInfo.score }}</div>
              </div>
            </van-col>
            <van-col span="12">
              <div class="stud-info">
                <div class="hb-name">
                  <i class="tip"></i>
                  <span class="name">学生姓名</span>
                </div>
                <div class="value">{{ studInfo.studName }}</div>
              </div>
            </van-col>
            <van-col span="24">
              <div class="stud-info">
                <div class="hb-name">
                  <i class="tip"></i>
                  <span class="name">学生学号</span>
                </div>
                <div class="value">{{ studInfo.studNo }}</div>
              </div>
            </van-col>
            <van-col span="8">
              <div class="stud-rank">
                <div class="class-rank">
                  <van-circle
                    class="rank-cir"
                    v-model="subScoreList[subScoreList.length - 1].classRanking"
                    :rate="peoNum.classSum"
                    layer-color="#B3D7EC"
                    color="#019BFA"
                    stroke-width="100"
                    :speed="100"
                    :size="80"
                    :text="
                      subScoreList[subScoreList.length - 1].classRanking + '名'
                    "
                  ></van-circle>
                  <div class="rank-name class">班级排名</div>
                </div>
              </div>
            </van-col>
            <van-col span="8">
              <div class="stud-rank">
                <div class="class-rank">
                  <van-circle
                    class="rank-cir"
                    v-model="subScoreList[subScoreList.length - 1].schoRanking"
                    :rate="peoNum.schoolSum"
                    layer-color="#fdeaae"
                    color="#ffc300"
                    stroke-width="100"
                    :speed="100"
                    :size="80"
                    :text="
                      subScoreList[subScoreList.length - 1].schoRanking + '名'
                    "
                  ></van-circle>
                  <div class="rank-name school">年级排名</div>
                </div>
              </div>
            </van-col>
            <van-col span="8">
              <div class="stud-rank">
                <div class="class-rank">
                  <van-circle
                    class="rank-cir"
                    v-model="subScoreList[subScoreList.length - 1].ranking"
                    :rate="peoNum.unionSum"
                    layer-color="#cbede8"
                    color="#42dfc8"
                    stroke-width="100"
                    :speed="100"
                    :size="80"
                    :text="subScoreList[subScoreList.length - 1].ranking + '名'"
                  ></van-circle>
                  <div class="rank-name ent">联考排名</div>
                </div>
              </div>
            </van-col>
          </van-row>
          <div class="score-table">
            <table class="know-table">
              <thead>
                <tr>
                  <th>科目</th>
                  <th>分数</th>
                  <th v-show="showEvaScore">赋分</th>
                  <th v-show="showRank">班级排名</th>
                  <th v-show="showRank">年级排名</th>
                  <th v-show="showRank">联校排名</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="subScore in subScoreList" :key="subScore.subId">
                  <td class="subName">{{ subScore.subName }}</td>
                  <td>{{ subScore.scoreVal }}</td>
                  <td v-show="showEvaScore">{{ subScore.scoreRate }}</td>
                  <td v-show="showRank">{{ subScore.classRanking }}</td>
                  <td v-show="showRank">{{ subScore.schoRanking }}</td>
                  <td v-show="showRank">{{ subScore.ranking }}</td>
                  <td>
                    <a
                      v-show="subScore.subName.indexOf('总分') === -1"
                      class="paper"
                      @click="showCardImg(subScore.subName)"
                      >查看答题卡</a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="score-cell">
          <div class="block-title">成绩水平分析</div>
          <div class="tip-desc">
            对比本次联考最好成绩和平均分，了解自身成绩水平在联校所处位置。
          </div>
          <score-level-chart
            :data="subScoreRadarChart"
            hight="280"
          ></score-level-chart>
          <table class="know-table">
            <thead>
              <tr>
                <th>科目</th>
                <th>分数</th>
                <th>班级平均分</th>
                <th>年级平均分</th>
                <th>联校平均分</th>
                <th>最高分</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="score in scoreAvgDetailTableList" :key="score.subId">
                <td class="subName">{{ score.subName }}</td>
                <td>{{ score.scoreVal }}</td>
                <td>{{ score.classAvg }}</td>
                <td>{{ score.schoolAvg }}</td>
                <td>{{ score.unionAvg }}</td>
                <td>{{ score.unionMax }}</td>
              </tr>
            </tbody>
          </table>
          <div class="content-desc">通过本次考试成绩的整体水平来看：</div>
          <div class="content-desc" v-html="analysisHtml"></div>
        </div>
        <div class="score-cell">
          <div class="block-title">
            科目对比分析
            <span
              class="tip-explain"
              type="standard_score"
              @click="subjectLayer"
            ></span>
          </div>
          <div class="tip-desc">
            通过标准分的对比可获知学生各科目成绩所处的实质水准。
          </div>
          <standard-score-chart
            :data="standardScoreChart"
          ></standard-score-chart>
          <table class="know-table">
            <thead>
              <tr>
                <th>科目</th>
                <th v-show="showRank">考试排名</th>
                <th>标准分数</th>
                <th>超过的考生比例</th>
                <th>成绩定位</th>
                <th>考生数量</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="scoreRate in scoreRateDetailTableList"
                :key="scoreRate.subId"
              >
                <td class="subName">{{ scoreRate.subName }}</td>
                <td v-show="showRank">{{ scoreRate.ranking }}</td>
                <td>{{ scoreRate.schStandardScore }}</td>
                <td>{{ scoreRate.rateExceed }}</td>
                <td>{{ scoreRate.scoreLevel }}</td>
                <td>{{ scoreRate.subNumUnion }}</td>
              </tr>
            </tbody>
          </table>
          <div class="content-desc">
            <p>通过分析得出：</p>
            <div v-html="scoreLevelDesc"></div>
          </div>
        </div>
        <div v-if="examPickerList.length === 1" class="score-cell">
          <div class="block-title">
            成绩进退步分析<span class="tip-explain" type="advance_param"></span>
          </div>
          <div class="tip-desc">
            标准分的趋势变化即代表真实成绩水平的变化，你可以在最近的几次考试中选择对比分析的对象。
          </div>
          <div class="content-desc" style="margin-top: 0">
            系统中只有一次你的考试信息，暂无成绩变化趋势的分析结果。
          </div>
        </div>
        <div v-else class="score-cell">
          <div class="block-title">
            成绩趋势分析
            <span
              class="tip-explain"
              type="advance_param"
              @click="resLayer"
            ></span>
          </div>
          <div class="content-desc">
            当我们每次考试都有了标准分以后，就可以将考生群体一致的多次考试进行对比分析，对比标准分的变化反映的就是成绩真正变化结果
          </div>
          <div class="exam-list">
            <div
              :class="
                activeClass == item.examId ? 'per-exam' : 'per-exam active'
              "
              v-for="item in examPickerList"
              :key="item.examId"
              @click="IsActive(item.examId)"
            >
              {{ item.text }}
            </div>
          </div>
          <div class="short-names">
            <div
              class="name-cell"
              v-for="(item, index) in multiExamObject.tbodyList"
              :key="index"
            >
              <div class="short-name">考试{{ index + 1 }} :</div>
              <div class="full-name">{{ item[0] }}</div>
            </div>
          </div>
          <exam-compare-chart :data="subStandardScore"></exam-compare-chart>
          <table id="manyExamScoreDetail" class="know-table">
            <thead>
              <tr>
                <th
                  v-for="(thead, index) in multiExamObject.theadList"
                  :key="index"
                >
                  {{ thead }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(trList, index) in multiExamObject.tbodyList"
                :key="index"
              >
                <td v-for="(item, cindex) in trList" :key="index + cindex">
                  {{ item }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="content-desc">
            我们还可以继续将标准分转化成为进步度分数，因为分数越高进步起来越困难，转化过程会给更高的标准分赋予更高的对应分数，这样就能更准确的评价历次成绩进退步的程度了
          </div>
          <exam-compare-chart :data="subImproveScore"></exam-compare-chart>
        </div>
      </div>
    </base-scroll>
    <van-popup v-model="showPickExam" round position="bottom">
      <van-picker
        show-toolbar
        :columns="examPickerList"
        @cancel="showPickExam = false"
        @confirm="changeExam"
      ></van-picker>
    </van-popup>
    <div v-show="cardImgsShow" class="ques-imgs-wrapper">
      <div class="modal-header">
        <div class="h-title">答题卡图片</div>
        <div class="right" @click="cardImgsShow = false">关闭</div>
      </div>
      <div class="image-wrap">
        <div id="oimage_container"></div>
      </div>
    </div>
    <van-dialog
      v-model="subDialog"
      title="科目标准分"
      message="    科目对比分析指的是科目标准分的对比分析，标准分能够反映考生在全体考生成绩中的位置，并且不同学科的标准分是可比的。标准分是指通过原始分转化而得到的一种地位量数，它反映考生成绩在全体考生成绩中的位置。因此，无论试题难或易，无论整体原始分偏高或偏低，整体标准分都没有什么变化。
      标准分通常会在20-80之间，高于50代表超过平均水平。当两个科目间标准分差大于20分时，则认为存在偏科情况。"
      message-align="left"
      confirm-button-text="我知道了"
      confirm-button-color="#6dd5fa"
    >
    </van-dialog>
    <van-dialog
      v-model="resDialog"
      title="进步度"
      message="    将标准分转化成为进步度分数，因为分数越高进步起来越困难，转化过程会给更高的标准分赋予更高的对应分数，这样就能更准确的评价历次成绩进退步的程度了"
      message-align="left"
      confirm-button-text="我知道了"
      confirm-button-color="#6dd5fa"
    >
    </van-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseScroll from '@/components/BaseScroll'
import ScoreLevelChart from './components/ScoreLevelChart'
import StandardScoreChart from './components/StandardScoreChart.vue'
import ExamCompareChart from './components/ExamCompareChart.vue'
import { getAllExam, getManyExam, getMyScoreData, getMyScoreSumData, getImageInfo } from '@/api/score-analysis'
import { SVG } from '@svgdotjs/svg.js'
import '@/styles/analysis.scss'

export default {
  name: 'MyScore',
  components: {
    BaseScroll,
    ScoreLevelChart,
    StandardScoreChart,
    ExamCompareChart
  },
  data () {
    return {
      studExamList: [],
      examPickerList: [], //联考任务列表
      showPickExam: false, // 我的所有考试选择框 显示
      studExam: {},
      studInfo: {},
      peoNum: {},
      subScoreList: [], // 我的所有科目成绩及其排名
      showEvaScore: false, // table是否显示赋分
      showRank: false, // table是否显示排名
      subScoreRadarChart: {}, // 科目雷达图 联校最高分 联校平均分 我的得分
      scoreAvgDetailTableList: [], // 各科成绩水平分析 table 数据
      analysisHtml: '', // 考试结果分析 文案
      standardScoreChart: {},
      scoreRateDetailTableList: [],
      scoreLevelDesc: '',
      multiExamObject: {}, //
      subStandardScore: {},
      subImproveScore: {},
      examScoresMap: {},
      cardImgsShow: false,
      activeClass: 0,
      subDialog: false,
      resDialog: false
    }
  },
  computed: {
    ...mapGetters([
      'examId'
    ])
  },
  created () {
    if (this.examId) {
      this.initData()
    } else {
      this.$notify({
        message: '没有找到考试信息',
        type: 'danger'
      })
    }
  },
  methods: {
    initData () {
      this.getMyAllExam()
    },
    // 获得所有考试
    getMyAllExam () {
      this.apiGetAllExam().then(res => {
        const { success, studentList } = res
        if (success === 'success') {
          if (studentList && studentList.length > 0) {
            const studExamList = []
            const examIdList = []
            for (const studExam of studentList) {
              const index = examIdList.indexOf(studExam.exam.id)
              if (index === -1) {
                studExamList.push(studExam)
                examIdList.push(studExam.exam.id)
                this.examPickerList.push({
                  text: studExam.exam.examName,
                  examId: studExam.exam.id
                })
                if (this.examId === studExam.exam.id) {
                  this.studExam = studExam
                  this.studInfo.studId = studExam.student.id
                  this.studInfo.studName = studExam.student.studentName
                  this.studInfo.studNo = studExam.student.studentNo
                  this.studInfo.examNo = studExam.examNo
                  this.initExamData()
                }
              }
            }
          }
        }
      })

    },
    showExamPicker () {
      this.showPickExam = true
    },
    changeExam (studExam) {
      this.studExam = studExam
      this.studInfo.studId = studExam.student.id
      this.studInfo.studName = studExam.student.studentName
      this.studInfo.studNo = studExam.student.studentNo
      this.studInfo.examNo = studExam.examNo
      this.initExamData()
    },
    initExamData () {
      const params = {
        studId: this.studInfo.studId,
        examId: this.examId,
        examNo: this.studInfo.examNo
      }
      this.apiGetMyScoreSumData(params).then(res => {
        const { success } = res
        if (success) {
          const scoreArr = res.scoreList
          const unionSum = res.unionSum
          const schoolSum = res.schoolSum
          const classSum = res.classSum
          let unionRate = 0
          let schoolRate = 0
          let classRate = 0
          const ranking = 0
          const schoRanking = 0
          const classRanking = 0
          if (scoreArr && scoreArr.length > 0) {
            for (const score of scoreArr) {
              if (score.subName === '总分') {
                this.studInfo.score = score.score
                const ranking = score.ranking
                const schoRanking = score.schoRanking
                const classRanking = score.classRanking
                if (unionSum !== 0 && ranking) {
                  unionRate = 10 - parseFloat((ranking / unionSum).toFixed(2)) * 10
                }
                if (schoolSum !== 0 && schoRanking) {
                  schoolRate = 10 - parseFloat((schoRanking / schoolSum).toFixed(3)) * 10
                }
                if (classSum !== 0 && classRanking) {
                  classRate = 10 - parseFloat((classRanking / classSum).toFixed(3)) * 10
                }
              }
            }
          }
          this.classRank = {
            classRate,
            classRanking
          }
          this.schoolRank = {
            schoolRate,
            schoRanking
          }
          this.unionRank = {
            unionRate,
            ranking
          }
          this.peoNum = {
            unionSum,
            schoolSum,
            classSum
          }
          // 此处echart抽离 用组件
        }
      })

      this.apiGetManyExam(this.studInfo.studId).then(res => {
        const { success } = res
        if (success === 'success') {
          const examScoresMap = res.examScoresMap
          this.initTimesExamData(examScoresMap)
          this.initColumnEchart(examScoresMap)

          this.examScoresMap = examScoresMap
          this.apiGetMyScoreData(params).then(res => {
            const { success, rankShowType } = res
            if (success === 'success') {
              if (rankShowType === 0) {
                this.rankChartShow = true
              } else {
                this.rankChartShow = false
              }
              this.initScoreLevelData(res)
            }
          })
        }
      })
    },
    // 初始化成绩分析数据
    initScoreLevelData (data) {
      const { scoreList, subClaAvgMap, subSchoolAvgMap, subUnionAvgMap, subUnionMaxMap, subNumMap, rankShowType, isChooseSub } = data
      const subList = []
      const mySubScore = []
      const unionAvgSubScore = []
      const unionMaxSubScore = []
      if (scoreList && scoreList.length !== 0) {
        this.scoreReportTableData(scoreList, isChooseSub, rankShowType) // 成绩汇报table

        const standardScoreSub = [] // 科目标准分的科目
        const standardScore = [] // 科目标准分值

        const goodSubArr = []
        let balanceSub = '---'
        const mySubScoreArr = []
        const unionSubScoreAvg = []
        const unionSubScoreMax = []
        for (const score of scoreList) {
          const subName = score.subName

          if (score.claStandardScore) {
            if (balanceSub === '---') {
              balanceSub = score.claStandardScore
            } else if (balanceSub > score.claStandardScore) {
              balanceSub = score.claStandardScore
            }
          }
          const subVo = {
            'id': score.subId,
            'subName': score.subName
          }
          subList.push(subVo)

          let schStandardScore = 0
          if (score.schStandardScore != null) {
            schStandardScore = score.schStandardScore
          }
          let scoreVal = '--'
          if (score.score) {
            scoreVal = score.score
          }

          if (scoreVal === '--') {
            mySubScore.push(0)
          } else {
            mySubScore.push(scoreVal)
            mySubScoreArr.push({
              subName: subName,
              score: scoreVal
            })
          }

          let unionAvg = 0
          if (subUnionAvgMap && Object.prototype.hasOwnProperty.call(subUnionAvgMap, score.subId)) {
            unionAvg = subUnionAvgMap[score.subId]
            unionAvgSubScore.push(Number(unionAvg.toFixed(2)))
            if (subName !== '总分') {
              if (scoreVal !== '--' && scoreVal > unionAvg) {
                goodSubArr.push(score.subName)
              }
              unionSubScoreAvg.push({ 'subName': subName, 'score': unionAvg })
            }
          } else {
            unionAvgSubScore.push(unionAvg)
          }

          let unionMax = 0
          if (undefined !== subUnionMaxMap && Object.prototype.hasOwnProperty.call(subUnionMaxMap, score.subId)) {
            unionMax = subUnionMaxMap[score.subId]
            unionMaxSubScore.push(unionMax)
            if (subName !== '总分') {
              unionSubScoreMax.push({ 'subName': subName, 'score': unionMax })
            }
          } else {
            unionMaxSubScore.push(unionMax)
          }

          // 科目标准分数据
          if (subName !== '总分') {
            standardScoreSub.push(subName)
            standardScore.push(schStandardScore)
          }
        }

        // 成绩水平分析
        this.initRadarAvgEchart(subList, unionMaxSubScore, unionAvgSubScore, mySubScore) // 成绩水平分析--科目联系分数雷达图
        this.scoreLevelTableData(scoreList, subClaAvgMap, subSchoolAvgMap, subUnionAvgMap, subUnionMaxMap) // 成绩水平分析--table
        this.getMyScoreMainDesc(mySubScoreArr, unionSubScoreMax, unionSubScoreAvg) // 成绩水平分析--下面总结

        // 科目对比分析 标准分雷达图
        this.standardScoreChart = {
          subList: standardScoreSub,
          dataValue: standardScore
        }
        this.subCompareTableData(scoreList, subNumMap) // 科目对比分析--table
        this.refreshScroll() // 刷新滚动
      }
    },
    // 成绩汇报 table 第一块内容的table数据
    scoreReportTableData (scoreArr, isChooseSub, rankShowType) {
      if (isChooseSub === '0' || isChooseSub === 0) {
        // 不显示赋分
        this.showEvaScore = false
      } else {
        this.showEvaScore = true
      }

      if (rankShowType === '0') {
        // 显示排名
        this.showRank = true
      } else {
        // 不显示排名
        this.showRank = false
      }

      for (const score of scoreArr) {
        const subName = score.subName

        let scoreVal = '--'
        let scoreRate = '--'
        let ranking = '--'
        let schoRanking = '--'
        let classRanking = '--'
        if (score.score) {
          scoreVal = score.score
        }
        if (score.subType && (score.subType === 2 || score.subType === 3) && score.rateScore) {
          scoreRate = score.rateScore
          if (scoreRate === -1 || scoreRate === '-1') {
            scoreRate = 'A'
          }
          if (scoreRate === -2 || scoreRate === '-2') {
            scoreRate = 'B'
          }
          if (scoreRate === -3 || scoreRate === '-3') {
            scoreRate = 'C'
          }
          if (scoreRate === -4 || scoreRate === '-4') {
            scoreRate = 'D'
          }
          if (scoreRate === -5 || scoreRate === '-5') {
            scoreRate = 'E'
          }
        }

        if (score.classRanking) {
          classRanking = score.classRanking
        }
        if (score.schoRanking) {
          schoRanking = score.schoRanking
        }
        if (score.ranking) {
          ranking = score.ranking
        }

        let opt = ''
        if (!score.merged) {
          opt = "<a class='paper' subName='" + subName + "'>查看答题卡</a>"
        }
        this.subScoreList.push({
          subId: score.subId,
          subName: subName,
          scoreVal: scoreVal,
          scoreRate: scoreRate,
          classRanking: classRanking,
          schoRanking: schoRanking,
          ranking: ranking,
          opt: opt
        })
      }
      this.refreshScroll()
    },
    // 成绩水平分析
    scoreLevelTableData (scoreArr, subClaAvgMap, subSchoolAvgMap, subUnionAvgMap, subUnionMaxMap) {
      for (const score of scoreArr) {
        const subName = score.subName

        let scoreVal = '--'
        if (score.score != null) {
          scoreVal = score.score
        }
        if (score.subType && score.subType === 2 && score.rateScore) {
          scoreVal = score.rateScore
        }

        let classAvg = 0
        if (subClaAvgMap && Object.prototype.hasOwnProperty.call(subClaAvgMap, score.subId)) {
          classAvg = subClaAvgMap[score.subId]
        }
        let schoolAvg = 0
        if (subSchoolAvgMap && Object.prototype.hasOwnProperty.call(subSchoolAvgMap, score.subId)) {
          schoolAvg = subSchoolAvgMap[score.subId]
        }

        let unionAvg = 0
        if (subUnionAvgMap && Object.prototype.hasOwnProperty.call(subUnionAvgMap, score.subId)) {
          unionAvg = subUnionAvgMap[score.subId]
        }

        let unionMax = 0
        if (subUnionMaxMap && Object.prototype.hasOwnProperty.call(subUnionMaxMap, score.subId)) {
          unionMax = subUnionMaxMap[score.subId]
        }

        this.scoreAvgDetailTableList.push({
          subId: score.subId,
          subName: subName,
          scoreVal: scoreVal,
          classAvg: classAvg.toFixed(2),
          schoolAvg: schoolAvg.toFixed(2),
          unionAvg: unionAvg.toFixed(2),
          unionMax: unionMax.toFixed(2)
        })
      }
      this.refreshScroll() // 刷新滚动
    },
    // 科目对比分析
    subCompareTableData (scoreArr, subNumMap) {
      const subScoreArr = []
      for (const score of scoreArr) {
        const subName = score.subName
        let subRateSum = 0
        let subNumUnion = 0

        let ranking = '--'
        if (score.ranking != null) {
          ranking = score.ranking
        }

        let schStandardScore = 0
        if (score.schStandardScore != null) {
          schStandardScore = score.schStandardScore
        }

        if (subNumMap && Object.prototype.hasOwnProperty.call(subNumMap, score.subId)) {
          const subSum = subNumMap[score.subId]
          subNumUnion = subNumMap[score.subId]
          if (ranking !== '--') {
            subRateSum = (parseFloat((ranking / subSum).toFixed(6)) * 100).toFixed(2)
          }
        }

        let scoreLevel = '良好'
        if (schStandardScore < 35) {
          scoreLevel = '较差'
        } else if (schStandardScore >= 35 && schStandardScore < 50) {
          scoreLevel = '一般'
        } else if (schStandardScore >= 65) {
          scoreLevel = '优秀'
        }

        let rateExceed = 0
        if (schStandardScore !== 0 && parseFloat(subRateSum) >= 0) {
          rateExceed = (100 - parseFloat(subRateSum)).toFixed(0)
        }
        this.scoreRateDetailTableList.push({
          subId: score.subId,
          subName: subName,
          ranking: ranking,
          schStandardScore: schStandardScore,
          rateExceed: rateExceed + '%',
          scoreLevel: scoreLevel,
          subNumUnion: subNumUnion
        })

        if (subName !== '总分') {
          subScoreArr.push({
            subName: subName,
            score: schStandardScore
          })
        }
      }

      // 文案的数据计算
      if (subScoreArr.length > 0) {
        subScoreArr.sort(this.compare('score'))
        const myMaxStandScore = subScoreArr[subScoreArr.length - 1].score
        const myMaxStandSub = subScoreArr[subScoreArr.length - 1].subName
        const myMinStandScore = subScoreArr[0].score
        const myMinStandSub = subScoreArr[0].subName
        const differval = Number(myMaxStandScore) - Number(myMinStandScore)
        let html = `<p class='circle'>你的优势学科是<span class='sub'>${myMaxStandSub}</span>、劣势学科是<span class='sub'>${myMinStandSub}</span>，两科标准分分差为${differval.toFixed(0)}`
        if (differval >= 20) {
          html += '，存在偏科情况。</p>'
        } else if (differval >= 0 && differval < 20) {
          html += '，不存在偏科情况。</p>'
        }

        const betterArr = []
        const lessArr = []
        for (const subScore of subScoreArr) {
          if (subScore.score > 50) {
            betterArr.push(subScore.subName)
          } else {
            lessArr.push(subScore.subName)
          }
        }

        if ((lessArr.length === subScoreArr.length) && lessArr.length !== 0) {
          html += "<p class='circle'>你所有学科均低于标准分平均水平，有待提升。</p>"
        } else if ((betterArr.length === subScoreArr.length) && betterArr.length !== 0) {
          html += "<p class='circle'>你所有学科均超过了标准分平均水平，需要继续巩固，保持优势。</p>"
        } else {
          html += `<p class='circle'><span class='sub'>${betterArr.join('、')}</span>超过了标准分平均水平，需要继续巩固，保持优势。</p>`
          html += `<p class='circle'><span class='sub'>${lessArr.join('、')}</span>低于标准分平均水平，有待提升。</p>`
        }
        this.scoreLevelDesc = html
      }
      this.refreshScroll()
    },
    initRadarAvgEchart (subList, unionMaxSubScore, unionAvgSubScore, mySubScore) {
      const subNameArr = []
      if (subList && subList.length !== 0) {
        for (const sub of subList) {
          let fullScore = 150
          if (this.examScoresMap) {
            for (const eId in this.examScoresMap) {
              if (this.examId === eId) {
                for (const subScore of this.examScoresMap[eId]) {
                  if (subScore.subName === sub.subName) {
                    fullScore = subScore.fullScore
                  }
                }
              }
            }
            if (!fullScore) {
              if (sub.subName === '语文' || sub.subName === '数学' || sub.subName === '英语' || sub.subName === '外语') {
                fullScore = 150
              } else if (sub.subName === '理综' || sub.subName === '理科综合' || sub.subName === '文综' || sub.subName === '文科综合') {
                fullScore = 150
              } else {
                fullScore = 100
              }
            }
          }
          subNameArr.push({
            name: sub.subName,
            max: fullScore
          })
        }
      }
      this.subScoreRadarChart = {
        subNameArr: subNameArr,
        unionMaxSubScore: unionMaxSubScore,
        unionAvgSubScore: unionAvgSubScore,
        mySubScore: mySubScore
      }
    },
    getMyScoreMainDesc (mySubScoreArr, unionSubScoreMax, unionSubScoreAvg) {
      if (mySubScoreArr && mySubScoreArr.length === 0) {
        return
      }
      mySubScoreArr.sort(this.compare('score'))
      let myMaxScore = 0
      let dValue = 0
      let bestSub = ''
      for (const scoreVo of mySubScoreArr) {
        const myscore = scoreVo.score
        const subName = scoreVo.subName
        for (const uScoreVo of unionSubScoreAvg) {
          if (uScoreVo.subName === subName) {
            const uAvgScore = uScoreVo.score
            if ((myscore - uAvgScore) > dValue) {
              dValue = myscore - uAvgScore
              bestSub = subName
              myMaxScore = myscore
            }
          }
        }
      }

      let unionMaxScore = 0
      for (const uScoreMax of unionSubScoreMax) {
        if (uScoreMax.subName === bestSub) {
          unionMaxScore = uScoreMax.score
        }
      }

      let unionAvgScore = 0
      for (const unScoreAvg of unionSubScoreAvg) {
        if (unScoreAvg.subName === bestSub) {
          unionAvgScore = unScoreAvg.score
        }
      }

      const differval = Number(unionMaxScore) - Number(myMaxScore)
      let html = `<p class='circle'><span class='sub'>${bestSub}</span>最为优秀，`
      if (differval === 0) {
        html += '你超过了联考的所有考生，真的是一骑绝尘。</p>'
      } else {
        html += `不过距离联校最高分还有<span class='less-score'>${differval.toFixed(0)}</span>分的差距，可以冲刺一下！</p>`
      }

      const betterArr = []
      const lessArr = []
      for (const item of mySubScoreArr) {
        const myScore = item.score
        const subName = item.subName
        let unionScore = 0
        for (const subScore of unionSubScoreAvg) {
          if (subScore.subName === subName) {
            unionScore = subScore.score
          }
        }
        if (myScore > unionScore) {
          betterArr.push(subName)
        } else if (myScore < unionScore) {
          lessArr.push(subName)
        }
      }

      const avgDiffScore = Number(unionAvgScore) - Number(myMaxScore)
      if ((lessArr.length === mySubScoreArr.length) && lessArr.length !== 0) {
        html += `<p class='circle'>所有科目均低于联校成绩平均水平,其中<span class='sub'></span>科目为个人最好成绩，与平均水准相差<span class='less-score'>${avgDiffScore}</span>分，请努力提升！</p>`
      } else if ((betterArr.length === mySubScoreArr.length) && betterArr.length !== 0) {
        html += `<p class='circle'>你所有学科均超过了平均水平，需要继续巩固，保持优势。</p>`
      } else {
        if (betterArr.length > 0) {
          html += `<p class='circle'><span class='sub'>${betterArr.join('、')}</span>科目超过了联校成绩平均水平，要保持优势，继续努力！</p>`
        }
        if (lessArr.length > 0) {
          html += `<p class='circle'><span class='sub'>${lessArr.join('、')}</span>低于联校成绩平均水平，有待提升！</p>`
        }
      }
      this.analysisHtml = html // 成绩结果分析最终文案
    },
    /*
    * 多次考试 科目标准分对比
    * */
    initTimesExamData (examScoresMap) {
      if (!examScoresMap) {
        return
      }
      const examNameArr = []
      const multiExamTheadList = ['考试']

      const allSubNameArr = []
      const seriesArr = []
      for (const scoreList in examScoresMap) {
        const examName = examScoresMap[scoreList][0].examName
        examNameArr.push(examName)
        const serData = [1, 5, 3, 6, 2, 6]
        for (const score of examScoresMap[scoreList]) {
          const index = allSubNameArr.findIndex(sub => {
            return score.subName === sub
          })
          if (index === -1) {
            allSubNameArr.push(score.subName)
            multiExamTheadList.push(score.subName)
          }

          if (score.claStandardScore) {
            serData.push(score.claStandardScore)
          } else {
            serData.push(0)
          }
        }

        const ser = {
          'name': scoreList[0].examName,
          'type': 'line',
          'smooth': true,
          'symbol': 'circle',
          'symbolSize': 5,
          'showSymbol': false,
          'lineStyle': {
            'normal': {
              'width': 1
            }
          },
          'data': serData
        }
        seriesArr.push(ser)
      }

      const multiExamtTbodyList = []
      for (const scoreList in examScoresMap) {
        const trList = []
        trList.push(examScoresMap[scoreList][0].examName)
        let num = 0
        for (const sub of allSubNameArr) {
          let hasSub = 0
          for (const score of examScoresMap[scoreList]) {
            if (sub === score.subName && hasSub === 0) {
              if (score.schStandardScore != null && (typeof (score.schStandardScore) !== 'object')) {
                trList.push(score.schStandardScore)
              } else {
                trList.push(0)
              }
              num++
              hasSub++
            }
          }
          if (hasSub === 0) {
            trList.push('--')
            num++
          }
        }
        if (num < allSubNameArr.length) {
          for (let n = 0; n < (allSubNameArr.length - num); n++) {
            trList.push('--')
          }
        }
        multiExamtTbodyList.push(trList)
      }
      this.multiExamObject = {
        theadList: multiExamTheadList,
        tbodyList: multiExamtTbodyList
      }
    },
    initColumnEchart (examScoresMap) {
      const allSubNameArr = []
      const subMapArr = []
      const examNameList = []

      if (examScoresMap) {
        for (const scoreList in examScoresMap) {
          const subMap = {}
          for (const score of examScoresMap[scoreList]) {
            const index = allSubNameArr.findIndex(sub => {
              return score.subName === sub
            })
            if (index === -1) {
              allSubNameArr.push(score.subName)
            }
            let schStandardScore = score.schStandardScore
            if (schStandardScore == null || (typeof (schStandardScore) === 'object')) {
              schStandardScore = 0
            }
            const progVal = (0.9966 * Math.pow(1.0473, schStandardScore)).toFixed(2)
            subMap[score.subName] = progVal
          }
          examNameList.push(scoreList[0].examName)
          subMapArr.push(subMap)
        }
      }
      const standardSerData = []
      const serData = []

      for (const sun of allSubNameArr) {
        const curSub = sun
        const curSubVal = []
        const curStandardVal = []
        for (const scoreList in examScoresMap) {
          for (const score of examScoresMap[scoreList]) {
            if (score.subName === curSub) {
              let schStandardScore = score.schStandardScore
              if (schStandardScore == null || (typeof (schStandardScore) === 'object')) {
                schStandardScore = 0
              }
              curStandardVal.push(schStandardScore)
              const progVal = (0.9966 * Math.pow(1.0473, schStandardScore)).toFixed(2)
              curSubVal.push(progVal)
            }
          }
        }
        standardSerData.push({
          name: curSub,
          type: 'line',
          data: curStandardVal
        })
        serData.push({
          name: curSub,
          type: 'line',
          data: curSubVal
        })
      }

      const fullNamelist = []
      const shortNameList = []
      // $('#short_names').empty()
      for (let i = 0; i < examNameList.length; i++) {
        const shortName = '联考' + (i + 1)
        fullNamelist.push({
          'shortName': shortName,
          'fullName': examNameList[i]
        })
        shortNameList.push(shortName)
        // const cell = "<div class='name-cell'><div class='short-name'>" + shortName + "&nbsp;:&nbsp;</div><div class='full-name'>" + examNameList[i] + '</div></div>'
        // $('#short_names').append(cell)
      }

      let chartHeight = 300
      if (allSubNameArr.length > 0 && allSubNameArr.length <= 8) {
        chartHeight = 300
      } else if (allSubNameArr.length > 8 && allSubNameArr.length <= 12) {
        chartHeight = 350
      } else if (allSubNameArr.length > 12) {
        chartHeight = 400
      }
      this.subStandardScore = {
        yName: '科目标准分',
        allSubNameArr: allSubNameArr,
        shortNameList: shortNameList,
        serData: standardSerData,
        chartHeight: chartHeight
      }

      this.subImproveScore = {
        yName: '进步分',
        allSubNameArr: allSubNameArr,
        shortNameList: shortNameList,
        serData: serData,
        chartHeight: chartHeight
      }
    },
    showCardImg (subName) {
      if (!subName) {
        return
      }
      const params = {
        examId: this.examId,
        examNo: this.studExam.examNo,
        subName: subName
      }
      this.apiGetImageInfo(params).then(res => {
        const { success, data, message } = res
        if (success) {
          this.cardImgsShow = true
          this.showSvgCardImg(data)
        } else {
          this.$notify({
            message: message,
            type: 'danger'
          })
        }
      })
    },
    showSvgCardImg (data) {
      const { online, markImageVo } = data
      const { eExamAreaVos, objScore, orgImgPaths, subScore, totalScore } = markImageVo
      if (!orgImgPaths || orgImgPaths.length === 0) {
        return
      }
      const parentW = document.documentElement.clientWidth
      orgImgPaths.forEach((d, v) => {
        const index = d.lastIndexOf('.')
        let imgPath = ''
        if (online === 1) {
          imgPath = d
        } else {
          imgPath = d.substring(0, index) + '_' + d.substring(index)
        }

        const svg = SVG().addTo('#oimage_container').size('100%', 400)
        svg.image(imgPath, function (e) {
          const scaleNum = parentW / this.width()
          svg.width(parentW)
          svg.height(this.height() * scaleNum)
          svg.viewbox(0, 0, parentW, this.height() * scaleNum)

          this.size(this.width() * scaleNum, this.height() * scaleNum)

          const g = svg.group().attr({ 'stroke': 'red', 'fill': 'none', 'stroke-width': 0 })
          const text = g.text('总分:' + totalScore + ' 客观题:' + objScore + ' 主观题:' + subScore)
          if (online === 1) {
            text.font({ 'fill': 'red', 'size': 15 })
          } else {
            text.font({ 'fill': 'red', 'size': 60 })
          }
          g.scale(scaleNum, 0, 0)
          g.move(0, 0)

          eExamAreaVos.forEach((d1, v1) => {
            const score = d1.score
            const areaPostilPaths = d1.areaPostilPaths

            for (let i = 0; i < areaPostilPaths.length; i++) {
              const imgNo = d1.imgNos[i]
              if (imgNo === (Number(v) + 1)) {
                for (const key in areaPostilPaths[i]) {
                  const areaStr = key
                  const areaArr = areaStr.split(',')
                  const x1 = Number(areaArr[0])
                  const y1 = Number(areaArr[1])
                  const x2 = Number(areaArr[2])
                  const y2 = Number(areaArr[3])

                  if (areaPostilPaths[i][key] && !/^http/.test(areaPostilPaths[i][key])) {
                    const obj = JSON.parse(areaPostilPaths[i][key])
                    obj.forEach((d, v) => {
                      if (d.type === 1) {
                        const g = svg.group().attr({
                          'stroke': '#ff0000',
                          'fill': 'none',
                          'stroke-width': online === 1 ? 3 : 5
                        })
                        g.path('M4 25 L28 52.5 L76 6.5')

                        g.scale(scaleNum, (d.x / d.scale + x1) * scaleNum, (d.y / d.scale + y1) * scaleNum)
                        g.move((d.x / d.scale + x1) * scaleNum, (d.y / d.scale + y1) * scaleNum)
                      } else if (d.type === 2) {
                        const g = svg.group().attr({
                          'stroke': '#ff0000',
                          'fill': 'none',
                          'stroke-width': online === 1 ? 3 : 5
                        })
                        g.line(55, 55, 6, 6)
                        g.line(55, 6, 6, 55)
                        g.scale(scaleNum, (d.x / d.scale + x1) * scaleNum, (d.y / d.scale + y1) * scaleNum)
                        g.move((d.x / d.scale + x1) * scaleNum, (d.y / d.scale + y1) * scaleNum)
                      } else if (d.type === 3) {
                        const g = svg.group().attr({
                          'stroke': '#ff0000',
                          'fill': 'none',
                          'stroke-width': online === 1 ? 3 : 5
                        })
                        g.line(5, 26, 27, 53)
                        g.line(76, 7.5, 26, 50.5)
                        g.line(51, 6.5, 74, 33.5)
                        g.scale(scaleNum, (d.x / d.scale + x1) * scaleNum, (d.y / d.scale + y1) * scaleNum)
                        g.move((d.x / d.scale + x1) * scaleNum, (d.y / d.scale + y1) * scaleNum)
                      } else if (d.type === 4) {
                        const g = svg.group().attr({
                          'stroke': 'red',
                          'fill': 'none',
                          'stroke-width': 0
                        })
                        const text = g.text(d.text)
                        if (online === 1) {
                          text.font({ 'fill': 'red', 'size': 15 })
                        } else {
                          text.font({ 'fill': 'red', 'size': 50 })
                        }

                        g.scale(scaleNum, (d.x / d.scale + x1) * scaleNum, (d.y / d.scale + y1) * scaleNum)
                        g.move((d.x / d.scale + x1) * scaleNum, (d.y / d.scale + y1) * scaleNum)
                      } else if (d.type === 5) {
                        const g = svg.group().attr({
                          'stroke': 'red',
                          'fill': 'none',
                          'stroke-width': 0
                        })
                        const text = g.text(d.text)
                        if (online === 1) {
                          text.font({ 'fill': 'red', 'size': 15 })
                        } else {
                          text.font({ 'fill': 'red', 'size': 50 })
                        }

                        g.scale(scaleNum, (d.x / d.scale + x1) * scaleNum, (d.y / d.scale + y1) * scaleNum)
                        g.move((d.x / d.scale + x1) * scaleNum, (d.y / d.scale + y1) * scaleNum)
                      } else if (d.type === 6) {
                        const g = svg.group().attr({
                          'stroke': 'red',
                          'fill': 'none',
                          'stroke-width': 0
                        })
                        const text = g.text(d.text ? d.text : '')
                        if (online === 1) {
                          text.font({ 'fill': 'red', 'size': 15 })
                        } else {
                          text.font({ 'fill': 'red', 'size': 60 })
                        }

                        g.scale(scaleNum, (d.x / (d.scale === 0 ? 1 : d.scale) + x1) * scaleNum, (d.y / (d.scale == 0 ? 1 : d.scale) + y1) * scaleNum)
                        if (online === 1) {
                          g.move((d.x / (d.scale === 0 ? 1 : d.scale) + x1) * scaleNum, (d.y / (d.scale == 0 ? 1 : d.scale) + y1) * scaleNum + 25)
                        } else {
                          g.move((d.x / (d.scale === 0 ? 1 : d.scale) + x1) * scaleNum, (d.y / (d.scale == 0 ? 1 : d.scale) + y1) * scaleNum)
                        }
                      } else if (d.type === 7) {
                        const pathPoint = d.path
                        const datas = pathPoint.split(',')
                        if (datas.length > 4) {
                          const g = svg.group()
                          const a = this.points2path(datas, 1)
                          const path = g.path(a)
                          path.attr('style', 'fill:none;stroke:red;stroke-width:' + (online == 1 ? 3 : 5))
                          g.scale(scaleNum, (d.x / d.scale + x1) * scaleNum, (d.y / d.scale + y1) * scaleNum)
                          g.move((d.x / d.scale + x1) * scaleNum, (d.y / d.scale + y1) * scaleNum)
                        }
                      }
                    })
                  }
                }
              }
            }

            if (online === 0 && d1.imgNos[0] === (Number(v) + 1)) {
              const area = areaPostilPaths[0]
              for (const key in area) {
                const areaStr = key
                const areaArr = areaStr.split(',')
                const y1 = Number(areaArr[1])
                const x2 = Number(areaArr[2])
                let txt = '得分:' + score
                let l = (x2 - 100) * scaleNum
                let t = y1 * scaleNum

                if (d1.type === 1) {
                  txt = score + ''
                  l = x2 * scaleNum + 5
                  t = y1 * scaleNum - 10
                }
                const g = svg.group().attr({
                  'stroke': 'red',
                  'fill': 'none',
                  'stroke-width': 0
                })
                const text = g.text(txt)
                text.font({ 'fill': 'red', 'size': 40 })

                g.scale(scaleNum, l, t)
                g.move(l, t)
              }
            }
          })
        })
      })
    },
    points2path (data, k = 1) {
      const size = data.length
      const last = size - 4
      let path = 'M' + data[0] + ',' + data[1]
      for (let i = 0; i < size - 2; i += 2) {
        const x0 = i ? Number(data[i - 2]) : Number(data[0])
        const y0 = i ? Number(data[i - 1]) : Number(data[1])
        const x1 = Number(data[i + 0])
        const y1 = Number(data[i + 1])
        const x2 = Math.ceil(Number(data[i + 2]))
        const y2 = Math.ceil(Number(data[i + 3]))
        const x3 = i !== last ? Number(data[i + 4]) : x2
        const y3 = i !== last ? Number(data[i + 5]) : y2
        const cp1x = Math.ceil(x1 + (x2 - x0) / 6 * k)
        const cp1y = Math.ceil(y1 + (y2 - y0) / 6 * k)
        const cp2x = Math.ceil(x2 - (x3 - x1) / 6 * k)
        const cp2y = Math.ceil(y2 - (y3 - y1) / 6 * k)
        path += 'C' + cp1x + ',' + cp1y + ',' + cp2x + ',' + cp2y + ',' + x2 + ',' + y2
      }

      return path
    },
    compare (property) {
      return function (a, b) {
        const value1 = a[property]
        const value2 = b[property]
        return value1 - value2
      }
    },
    refreshScroll () {
      this.$nextTick(() => {
        this.$refs.contentScroll.refresh()
      })
    },
    apiGetAllExam () {
      return new Promise((resolve, reject) => {
        getAllExam().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetManyExam (studId) {
      return new Promise((resolve, reject) => {
        getManyExam(studId).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetMyScoreSumData (data) {
      return new Promise((resolve, reject) => {
        getMyScoreSumData(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetMyScoreData (data) {
      return new Promise((resolve, reject) => {
        getMyScoreData(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetImageInfo (data) {
      return new Promise((resolve, reject) => {
        getImageInfo(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    IsActive (key) {
      this.activeClass = key
    },
    subjectLayer () {
      this.subDialog = true
    },
    resLayer () {
      this.resDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-wrapper {
  height: calc(100vh - 40px);
  overflow: hidden;
}
.stud-info {
  display: flex;
  align-items: center;
  height: 25px;
  .hb-name {
    display: flex;
    align-items: center;
    padding-left: 25px;
    .tip {
      display: block;
      width: 12px;
      height: 12px;
      flex: 0 0 12px;
      border-radius: 50%;
      background-color: #cee79a;
    }
    .name {
      margin-left: 5px;
      display: block;
      flex: 1;
      color: #858d9d;
      font-size: 12px;
    }
  }
  .value {
    display: inline-block;
    vertical-align: middle;
    color: #6dd5fa;
    font-size: 16px;
    font-weight: 500;
    margin-left: 10px;
    line-height: 25px;
  }
}

.stud-rank {
  display: flex;
  width: 100px;
  height: 120px;
  justify-content: center;
  align-items: center;
  .class-rank {
    position: relative;
    height: 80px;
    width: 80px;
    .rank-cir {
      transform: rotate(180deg);
      ::v-deep .van-circle__text {
        transform: translateY(-50%) rotate(180deg);
      }
    }
    .rank-name {
      position: absolute;
      left: 12px;
      bottom: -1px;
      width: 56px;
      height: 14px;
      font-size: 12px;
      line-height: 14px;
      text-align: center;
      border-radius: 4px;
      color: #fff;
    }
    .class {
      background-color: #019bfa;
    }
    .school {
      background-color: #ffc300;
    }
    .ent {
      background-color: #42dfc8;
    }
  }
}

.content-wrapper {
  .block-title {
    width: 100%;
    padding: 5px 15px;
    font-size: 16px;
    color: #6dd5fa;
    font-weight: 500;
    &::before {
      content: "";
      border-left: 4px solid #6dd5fa;
      margin-right: 8px;
    }
    .tip-explain {
      float: right;
      display: block;
      background: url(http://weixin.521kcb.com/static2/images/icon/icon-explain.png)
        no-repeat center;
      width: 24px;
      height: 24px;
      background-size: 18px 18px;
    }
  }
  .tip-desc {
    font-size: 12px;
    color: #b6bec8;
    margin: 10px 15px;
    line-height: 1.6;
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
  }
  .exam-list {
    padding: 15px;
    .per-exam.active {
      display: inline-block;
      vertical-align: middle;
      border-radius: 4px;
      font-size: 14px;
      padding: 2px 5px;
      margin-right: 5px;
      margin-bottom: 5px;
      background-color: #6dd5fa;
      color: #fff;
    }
    .per-exam {
      display: inline-block;
      vertical-align: middle;
      border-radius: 4px;
      font-size: 14px;
      padding: 2px 5px;
      margin-right: 5px;
      margin-bottom: 5px;
      background-color: #eaeef4;
      color: #8d99a6;
    }
  }
  .short-names {
    padding: 5px 15px;
    .name-cell {
      .short-name {
        display: inline-block;
        font-size: 14px;
        color: #8d99a6;
      }
      .full-name {
        display: inline-block;
        font-size: 12px;
        color: #8d99a6;
      }
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
      border-left: 1px solid #91e0f9;
      font-weight: 500;
      &:first-child {
        text-align: left;
        padding-left: 14px;
        color: #858d9d;
        border-left: 0;
      }
    }
  }
}
.ques-imgs-wrapper {
  height: 100vh;
  width: 100vw;
  background: #fff;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  .modal-header {
    height: 40px;
    line-height: 40px;
    background: #4381e5;
    display: flex;
    .h-title {
      color: #fff;
      font-size: 14px;
      text-align: center;
      flex: 1;
    }
    .left {
      width: 80px;
      flex: 0 0 80px;
      color: #fff;
      font-size: 14px;
      padding-left: 14px;
      box-sizing: border-box;
    }
    .right {
      width: 80px;
      flex: 0 0 80px;
      color: #fff;
      font-size: 14px;
      text-align: right;
      padding-right: 14px;
      box-sizing: border-box;
    }
  }
  .upload-wrap {
    padding: 0 14px;
    .scroll-wrapper {
      height: calc(100vh - 40px);
      position: relative;
      overflow: hidden;
    }
    .area-title {
      padding: 8px 0;
      font-size: 14px;
      color: #000;
    }
  }
}
</style>
