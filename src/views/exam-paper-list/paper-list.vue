<template>
  <div class="page-container">
    <page-header title="试卷列表"></page-header>
    <base-scroll class="scroll-wrapper" :data="paperList">
      <div class="paper-list">
        <div v-for="paper in paperList" :key="paper.paperId" class="paper-cell">
          <div class="p-name">{{ paper.pName }}</div>
          <p class="p-time">考试时间：{{ examTimeStr(paper) }}</p>
          <div class="time-score">
            <span class="item">满分： <span class="val">{{ paper.fullS }}分</span></span>
            <span class="item">考试时长：<span class="val">{{ paper.eLen }}分钟</span></span>
            <span class="item">科目：<span class="val">{{ paper.sub }}</span></span>
          </div>
          <div class="cell-footer">
            <div class="border-btn" :class="{disabled: !checkInlineExam(paper)}" @click="goExam(paper)">考试</div>
            <div class="border-btn" :class="{disabled: !checkEntryExam(paper)}" @click="enterAnswer(paper)">录答案</div>
            <!-- <div class="border-btn">完成</div> -->
            <!-- <div class="border-btn" :class="{disabled: paper.openAnal !== 1}" @click="goAnalysis(paper)">解析</div> -->
            <div class="border-btn" :class="{disabled: paper.openAdd !== 1}" @click="addAnswer(paper)">补录</div>
            <!-- <div class="border-btn" @click="downloadFile(paper)">下载</div> -->
          </div>
        </div>
      </div>
    </base-scroll>
    <!-- 考试进入前提示框 -->
    <van-overlay :show="examTipShow">
      <div class="tip-wrapper" @click.stop>
        <div class="content">
          <div class="btn-close" @click="examTipShow = false">
            <van-icon name="cross"></van-icon>
          </div>
          <p class="title">注意事项</p>
          <div class="tip-text">
            <p>1.进入考试后，需要在规定时间以内完成并交卷，交卷后答案不能再做修改</p>
            <p>2.考试过程中如遇退出等意外情况，请重新进入，原有答案不会丢失，可点击左上角题号切换题目</p>
            <p>3.请准备好答题纸，在纸上写下主观题答案及完整的解题步骤</p>
            <p style="color: #ff5151">4.无论是否完成答题，请在规定时间内点击“交卷”提交答案，否则试卷无效，视作放弃考试</p>
            <p>5.交卷后耐心等待学校开放成绩查询，可通过“查成绩”功能进行试卷分析和查询排名</p>
            <p></p>
          </div>
          <div class="btn-row">
            <van-button type="info" @click="confirmLinkTo">我已阅读，开始答题</van-button>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import BaseScroll from '@/components/BaseScroll'
import { getExamPaperList } from '@/api/exam'

export default {
  name: 'ExamPapers',
  components: {
    PageHeader,
    BaseScroll
  },
  data() {
    return {
      examId: '',
      paperList: [],
      dataLoading: false,
      examTipShow: false
    }
  },
  created() {
    this.examId = this.$route.query.examId
    if (this.examId) {
      this.initPapers()
    } else {
      this.$notify({
        message: '没有找到考试信息',
        type: 'danger'
      })
    }
  },
  methods: {
    initPapers() {
      this.dataLoading = true
      this.apiGetExamPaperList(this.examId).then(res => {
        const { success, eExamPaperListVos } = res
        if (success) {
          this.paperList = eExamPaperListVos
          // this.dataLoading = false
        } else {
          this.$notify({
            message: '试卷获取失败',
            type: 'danger'
          })
        }
      })
    },
    confirmLinkTo() {
      if (this.type === 'online') {
        this.$router.push({
          path: '/exam-paper-ques',
          query: { examId: this.examId, paperId: this.curPaper.paperId, subName: this.curPaper.sub }
        })
      }

      if (this.type === 'entry') {
        this.$router.push({
          path: '/exam-paper-ques-entry',
          query: { examId: this.examId, paperId: this.curPaper.paperId, subName: this.curPaper.sub }
        })
      }
    },
    // 跳转到考试页面
    goExam(paper) {
      if (!this.checkInlineExam(paper)) {
        return false
      }
      this.examTipShow = true
      this.curPaper = paper
      this.type = 'online'
    },
    // 录入答案
    enterAnswer(paper) {
      if (!this.checkEntryExam(paper)) {
        return false
      }
      this.examTipShow = true
      this.curPaper = paper
      this.type = 'entry'
    },
    checkInlineExam(paper) {
      let result = false
      const { scanStatus, checkExam, pStauts, model } = paper
      if (scanStatus === 1 && ((checkExam === 1 && (pStauts === -1 || pStauts === 0)) || (checkExam === 0 && pStauts === 0))) {
        if (model === 1 || model === 2) {
          result = true
        }
      }
      return result
    },
    checkEntryExam(paper) {
      let result = false
      const { scanStatus, checkExam, pStauts, model } = paper
      if (scanStatus === 1 && ((checkExam === 1 && (pStauts === -1 || pStauts === 0)) || (checkExam === 0 && pStauts === 0))) {
        if (model === 1 || model === 3) {
          result = true
        }
      }
      return result
    },
    // 查看解析
    goAnalysis(paper) {
      if (paper.openAnal && paper.openAnal === 1) {
        this.$router.push({
          path: '/exam-paper-ques-analysis',
          query: { examId: this.examId, paperId: paper.paperId, subName: paper.sub }
        })
      }
    },
    // 补录答案
    addAnswer(paper) {
      if (paper.openAnal && paper.openAdd === 1) {
        this.$router.push({
          path: '/exam-paper-addimg',
          query: { examId: this.examId, paperId: paper.paperId, subName: paper.sub }
        })
      }
    },
    // 下载相关文件
    downloadFile() {

    },
    // 格式化考试起止时间
    examTimeStr(paper) {
      const beginExamStr = paper.beginExamStr
      const endExamStr = paper.endExamStr
      let startTimeStr = ''
      if (beginExamStr && beginExamStr.length >= 16) {
        startTimeStr += `${beginExamStr.substring(5, 16)}`
      }
      let endTimeStr = ''
      if (endExamStr && endExamStr.length >= 16) {
        endTimeStr = `${endExamStr.substring(11, 16)}`
      }
      return `${startTimeStr} - ${endTimeStr}`
    },
    apiGetExamPaperList(examId) {
      return new Promise((resolve, reject) => {
        getExamPaperList(examId).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.scroll-wrapper{
  height: calc(100vh - 40px);
  overflow: hidden;
}
.paper-list{
  padding-top: 10px;
  .paper-cell{
    margin: 0 10px 10px;
    padding: 10px;
    background-color: #fff;
    box-shadow: -2px 0 2px rgba(0, 0, 0, 0.05),
    2px 0 2px rgba(0, 0, 0, 0.05),
    0 -2px 2px rgba(0, 0, 0, 0.05),
    0 2px 2px rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    .p-name{
      color: #4e565f;
      font-size: 16px;
    }
    .p-time{
      color: #4e565f;
      font-size: 14px;
      margin: 5px 0;
    }
    .time-score{
      color: #8d99a6;
      font-size: 12px;
      line-height: 2;
      border-bottom: 1px solid #4381E5;
      .item{
        margin-right: 15px;
        .val{
          color: #4e565f;
        }
      }
    }
    .cell-footer{
      margin-top: 5px;
      .border-btn{
        margin-right: 8px;
      }
    }
  }
}
.tip-wrapper{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .content {
    width: 90%;
    margin: auto;
    padding: 0 20px;
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    .btn-close{
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 20px;
    }
    .title{
      text-align: center;
      font-weight: 600;
      font-size: 18px;
      line-height: 50px;
      color: #4d5d6d;
      border-bottom: 2px solid #ccc;
    }
    .tip-text{
      color: #4d5d6d;
      font-size: 14px;
      margin-top: 5px;
      line-height: 1.6;
    }
    .btn-row{
      margin-top: 30px;
      margin-bottom: 30px;
      text-align: center;
      ::v-deep .van-button{
        width: 200px;
        height: 32px;
      }
    }
  }
}
</style>
