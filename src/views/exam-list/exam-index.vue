<template>
  <div class="page-container">
    <page-header :left-arrow="false" title="考试"></page-header>
    <base-scroll class="scroll-wrapper" :data="examList">
      <div class="exam-list">
        <div v-for="exam in examList" :key="exam.id" class="outer-block">
          <div class="inner-block">
            <div class="exam-content">
              <p class="exam-name">{{ exam.examName }}</p>
            </div>
            <div class="exam-footer">
              <van-row v-if="isOnlineExam(exam)">
                <van-col span="12" class="border-right">
                  <span class="btn-text" @click="linkToPapers(exam)">考试</span>
                </van-col>
                <van-col span="12">
                  <span class="btn-text" @click="linkToScore(exam)">成绩</span>
                </van-col>
              </van-row>
              <van-row v-else>
                <van-col span="24">
                  <span class="btn-text" @click="linkToScore(exam)">查成绩</span>
                </van-col>
              </van-row>
            </div>
          </div>
        </div>
      </div>
    </base-scroll>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import PageHeader from '@/components/PageHeader'
import BaseScroll from '@/components/BaseScroll'
import { getStudentExamList } from '@/api/exam'

export default {
  name: 'Home',
  components: {
    PageHeader,
    BaseScroll
  },
  data() {
    return {
      examList: []
    }
  },
  created() {
    this.initExam()
  },
  methods: {
    ...mapActions('exam', ['saveCurrentExamId']),
    // 初始化考试列表
    initExam() {
      this.apiGetStudentExamList().then(res => {
        const { success, eExamVoList, message } = res
        if (success) {
          this.examList = eExamVoList
        } else {
          this.$notify({
            message: message,
            type: 'danger'
          })
        }
      })
    },
    isOnlineExam(exam) {
      return exam !== undefined && exam.online !== undefined && exam.online === 1
    },
    // 跳转到考试
    linkToPapers(exam) {
      if (exam.online && exam.online === 1) {
        this.$router.push({
          path: '/exam-papers',
          query: { examId: exam.id }
        })
      }
    },
    // 跳转到成绩
    linkToScore(exam) {
      if (exam.published && exam.published !== 0) {
        this.saveCurrentExamId(exam.id)
        this.$router.push({
          path: '/exam-analysis/my-score',
          query: { examId: exam.id }
        })
      }
    },
    apiGetStudentExamList() {
      return new Promise((resolve, reject) => {
        getStudentExamList().then(res => {
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
.exam-list{
  display: flex;
  padding: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
  .outer-block{
    width: 50%;
    &:nth-child(odd){
      padding-right: 5px;
    }
    &:nth-child(even){
      padding-left: 5px;
    }
    .inner-block{
      box-shadow: 0 -4px 5px -3px rgba(0,0,0,0.1),
      4px 0 5px -3px rgba(0,0,0,0.1),
      -4px 0 5px -3px rgba(0,0,0,0.1),
      0 4px 5px -3px rgba(0,0,0,0.1);
      display: block;
      margin: 0 0 15px;
    }
    .exam-content{
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #91B6F2;
      height: 32vw;
      overflow-y: hidden;
      border-radius: 4px 4px 0 0;
      .exam-name{
        font-size: 14px;
        color: #393327;
        text-align: center;
        padding: 10px 10px;
      }
    }
    .exam-footer{
      background-color: #fff;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 0 0 4px 4px;
      .border-right{
        position: relative;
        &::before{
          content: '';
          position: absolute;
          border-right: 1px solid #ccc;
          top: 6px;
          right: 0;
          height: 20px;
          display: block;
        }
      }
    }
  }
}
</style>
