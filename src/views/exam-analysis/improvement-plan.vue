<template>
  <div class="page-container">
    <base-scroll class="scroll-wrapper" :data="tableData">
      <div class="content-wrapper">
        <van-tabs @change="changeSub">
          <van-tab v-for="sub in subList" :key="sub.subId" :title="sub.subName">
            <div class="data-container">
              <div class="score-cell">
                <div class="content-desc">
                  通过对你的学科能力及本次试卷整体答题情况的分析，你本学科至少还有<span class="my-improve up">{{ improveScore }}</span>分的提升空间。请你认真听取试卷讲评，并对为你甄选出的错题变式题进行持续训练，以达成巩固和提升目标。
                </div>
                <div class="block-title">错题摘要</div>
                <div class="wrong-ques-row">
                  <span class="ques-title">总错题</span>
                  <span class="ques-num">{{ totalNum }}道</span>
                </div>
                <van-row>
                  <van-col v-for="(typeQues, name, index) in quesTypeMap" :key="index" span="12">
                    <div class="stud-info">
                      <div class="hb-name">
                        <i class="tip"></i>
                        <span class="name">{{ name }}</span>
                      </div>
                      <div class="value">{{ typeQues }}</div>
                    </div>
                  </van-col>
                </van-row>
                <div class="table-wrap">
                  <table class="know-table">
                    <thead>
                      <tr>
                        <th style="width: 8%">题号</th>
                        <th style="width: 32%">知识点</th>
                        <th style="width: 12%">答题<br>人数</th>
                        <th style="width: 12%">出错<br>人数</th>
                        <th style="width: 12%">得分率</th>
                        <th style="width: 24%">严重程度</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(ques) in tableData" :key="ques.quesId">
                        <td>{{ ques.quesNo }}</td>
                        <td>{{ ques.knows }}</td>
                        <td>{{ ques.count }}</td>
                        <td>{{ ques.wrongNum }}</td>
                        <td>{{ ques.scoreRate }}</td>
                        <td><van-rate v-model="ques.level" color="#ffb400" :size="14" icon="warn-o" void-icon="warn-o" readonly></van-rate></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="score-cell">
                <div class="block-title">变式精练</div>
                <div id="same_wp" class="content-wrapper">
                  <van-row class="van-row">
                    <van-col span="8">
                      <div class="block-wp">
                        <div class="img-wp">
                          <img :src="sameImage1">
                        </div>
                      </div>
                    </van-col>
                    <van-col span="8">
                      <div class="block-wp">
                        <div class="img-wp">
                          <img :src="sameImage2">
                        </div>
                      </div>
                    </van-col>
                    <van-col span="8">
                      <div class="block-wp">
                        <div class="img-wp">
                          <img :src="sameImage3">
                        </div>
                      </div>
                    </van-col>
                  </van-row>
                </div>
                <div class="weui-row">
                  <a id="enter_same_exer" class="confirm-btn">进入变式精练</a>
                </div>
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
import sameImage1 from '@/assets/exam/sametype-icon1.png'
import sameImage2 from '@/assets/exam/sametype-icon2.png'
import sameImage3 from '@/assets/exam/sametype-icon3.png'
import { getTsjhSubList, getWrongQuesTypeByPaperId, checkGenExerQuesList, getCurStudPopuInfoByExamId } from '@/api/score-analysis'
import { examInfoMixin } from '@/common/js/mixins'

export default {
  name: 'ImprovementPlan',
  components: {
    BaseScroll
  },
  mixins: [examInfoMixin],
  data() {
    return {
      studId: '',
      examNo: '',
      sameImage1,
      sameImage2,
      sameImage3,
      subList: [],
      curSubId: '',
      paperId: '',
      quesTypeMap: {},
      improveScore: 0,
      totalNum: 0,
      tableData: []
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

      const params = {
        studId: this.studId,
        examId: this.examId,
        examNo: this.examNo
      }
      this.apiGetTsjhSubList(params).then(res => {
        const { success } = res
        if (success === 'success') {
          this.subList = res.scoreVos
          this.curSubId = this.subList[0].subId
          this.paperId = this.subList[0].paperId
          this.initWrongQues(this.paperId)
        }
      })
    },
    changeSub(index) {
      const paperId = this.subList[index].paperId
      this.initWrongQues(paperId)
    },
    initWrongQues(paperId) {
      const params = {
        paperId: paperId,
        examId: this.examId
      }
      this.apiGetWrongQuesTypeByPaperId(params).then(res => {
        const { success } = res
        if (success === 'success') {
          this.quesTypeMap = res.wrongTypeNumMap
          const wrongQuesAnaVos = res.wrongQuesAnaVos
          this.improveScore = res.rightScore

          let totalNum = 0
          this.tableData = []
          for (const key in this.quesTypeMap) {
            totalNum += this.quesTypeMap[key]
          }
          this.totalNum = totalNum

          if (wrongQuesAnaVos && wrongQuesAnaVos.length !== 0) {
            for (let i = 0; i < wrongQuesAnaVos.length; i++) {
              const wrongQuesAnaVo = wrongQuesAnaVos[i]
              const quesNo = wrongQuesAnaVo.quesFullNo
              const rkonws = wrongQuesAnaVo.rkonws
              const countTal = wrongQuesAnaVo.countTal
              const wrongNum = wrongQuesAnaVo.wrongNum
              const scoreRate = wrongQuesAnaVo.scoreRate
              const difficulty = wrongQuesAnaVo.difficulty

              const level = difficulty === 1 ? 3 : 2

              this.tableData.push({
                quesId: wrongQuesAnaVo.quesId,
                quesNo: quesNo,
                knows: rkonws.join(','),
                count: countTal,
                wrongNum: wrongNum,
                scoreRate: (scoreRate * 100).toFixed(0) + '%',
                level: level
              })
            }
          }
        }
      })
    },
    apiGetTsjhSubList(data) {
      return new Promise((resolve, reject) => {
        getTsjhSubList(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiCheckGenExerQuesList(data) {
      return new Promise((resolve, reject) => {
        checkGenExerQuesList(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetWrongQuesTypeByPaperId(data) {
      return new Promise((resolve, reject) => {
        getWrongQuesTypeByPaperId(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetCurStudPopuInfoByExamId(examId) {
      return new Promise((resolve, reject) => {
        getCurStudPopuInfoByExamId(examId).then(res => {
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
.stud-info{
  display: flex;
  align-items: center;
  height: 25px;
  .hb-name{
    display: flex;
    align-items: center;
    padding-left: 15px;
    .tip{
      display: block;
      width: 12px;
      height: 12px;
      flex: 0 0 12px;
      border-radius: 50%;
      background-color: #cee79a;
    }
    .name{
      margin-left: 5px;
      display: block;
      flex: 1;
      color: #858d9d;
      font-size: 12px;
    }
  }
  .value{
    display: inline-block;
    vertical-align: middle;
    color: #6dd5fa;
    font-size: 16px;
    font-weight: 500;
    margin-left: 10px;
    line-height: 25px;
  }
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
    font-size: 12px;
    color: #b6bec8;
    margin: 10px 15px;
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
  }
}
.wrong-ques-row{
  padding-top: 15px;
  margin: 5px 15px 15px;
  border-top: 1px solid #eaeef4;
  .ques-title {
    // padding-left: 15px;
    font-size: 14px;
    color: #656d7d;
  }
  .ques-num{
    padding-right: 15px;
    font-size: 16px;
    color: #ff7f6a;
  }
}
.block-wp{
  text-align: center;
  margin: 0 8px;
  .img-wp{
    margin: 10px 0 15px;
    img{
      width: 100%;
    }
  }
  .desc{
    padding: 6px 0;
    border-top: 1px solid #6dd5fa;
    margin: 0 10px;
    text-align: justify;
    font-size: 12px;
    color: #656d7d;
    line-height: 1.4;
    height: 60px;
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
      // border-left: 1px solid #91e0f9;
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
::v-deep .van-tabs__wrap{
  border-bottom: 1px solid #d4dae6;
}
</style>
