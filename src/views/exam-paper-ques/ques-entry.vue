<template>
  <div class="page-container">
    <page-header title="答案录入">
      <van-count-down
        ref="countDown"
        class="white-count-down"
        :class="{lesstime: lessTime}"
        :time="examTime"
        format="HH:mm:ss"
        @finish="timeDownFinish"
        @change="timeDownChange"
      >
      </van-count-down>
    </page-header>
    <base-scroll ref="bsContent" class="scroll-wrapper" :data="quesList">
      <div class="content-container">
        <div class="entry-wrap">
          <div v-if="audioUrl" class="english-audio-wrap">
            <div class="play-btn" @click="startPlay">
              <van-icon v-if="!playingState" name="play-circle-o" size="24"></van-icon>
              <van-icon v-else-if="playingState" name="pause-circle-o" size="24"></van-icon>
            </div>
            <audio-player :paper-id="paperId" :audio-url="audioUrl"></audio-player>
          </div>
          <table class="entry-table">
            <thead>
              <tr><th>题号</th><th>题型</th><th>答案</th></tr>
            </thead>
            <tbody>
              <tr v-for="ques in quesList" :key="ques.quesId">
                <td><span class="ques-no" @click="showDetail(ques)">{{ ques.quesNo }}</span></td>
                <td>{{ ques.quesType }}</td>
                <td>
                  <div v-if="ques.quesType === '多选题'">
                    <van-checkbox-group v-model="ques.answer" class="space-class" direction="horizontal" @change="changeChoiceAnswer">
                      <van-checkbox v-for="choice in ques.choiceTextArr" :key="ques.quesId+choice.choice" :name="choice.choice">
                        <template #icon="props">
                          <span class="check-icon" :class="{'active': props.checked }">{{ choice.choice }}</span>
                        </template>
                      </van-checkbox>
                    </van-checkbox-group>
                  </div>
                  <div v-else>
                    <van-radio-group v-model="ques.answer" class="space-class" direction="horizontal" @change="changeChoiceAnswer">
                      <van-radio v-for="choice in ques.choiceTextArr" :key="ques.quesId+choice.choice" :name="choice.choice">
                        <template #icon="props">
                          <span class="check-icon" :class="{'active': props.checked }">{{ choice.choice }}</span>
                        </template>
                      </van-radio>
                    </van-radio-group>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="upload-wrap">
            <div v-for="(area, index) in areaImgList" :key="area.id" class="area-cell">
              <div class="area-title">题号：{{ area.quesNoText }}</div>
              <van-uploader
                v-model="area.imageList"
                :name="index"
                :before-read="beforeRead"
                :after-read="afterRead"
                :before-delete="delFromCard"
              ></van-uploader>
            </div>
          </div>
        </div>
      </div>
    </base-scroll>
    <van-button
      class="submit-btn"
      color="#4381E5"
      type="primary"
      block
      :loading="submitLoading"
      loading-text="提交中..."
      @click="submitAnswer"
    >交卷</van-button>
    <van-overlay class="ques-dialog" :show="showDialog">
      <div class="dialog-wrapper" @click.stop>
        <div class="close-btn" @click="showDialog = false">
          <van-icon name="cross"></van-icon>
        </div>
        <div class="ques-content" v-html="curQuesContent"></div>
      </div>
    </van-overlay>
    <!-- 考试结束提示框 -->
    <van-overlay :show="timeOverShow">
      <div class="time-over-wrapper" @click.stop>
        <div class="content">
          <p class="title">考试时间结束，请交卷！</p>
          <div class="image-wrap">
            <img :src="timeOverUrl">
          </div>
          <div class="btn-row">
            <van-button type="info" :loading="submitLoading" loading-text="提交中..." @click="submitAnswer('force')">确认交卷</van-button>
          </div>
        </div>
      </div>
    </van-overlay>
    <image-cropper
      :cropper-show="cropperShow"
      :image-url="imageUrl"
      :show-btn-loading="imageUploading"
      @hideModal="hideCropper"
      @submitImage="submitImage"
    ></image-cropper>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AudioPlayer from './components/AudioPlayer'
import PageHeader from '@/components/PageHeader'
import BaseScroll from '@/components/BaseScroll'
import ImageCropper from '@/components/ImageCropper'
import { getPaperQuesInfoList, getPaperInfo, getSubjectAreaList, savePaperQuesResult } from '@/api/exam'
import { getCdnPaperQuesList } from '@/api/cdn-exam'
import { normalizeChoicesQues } from '@/common/js/normalize'
import { quesAreaImageMixin, quesResultMixin } from '@/common/js/mixins'
import examOverIcon from '@/assets/exam/time-over.png'

export default {
  name: 'PaperQuesEntry',
  components: {
    PageHeader,
    ImageCropper,
    AudioPlayer,
    BaseScroll
  },
  mixins: [quesAreaImageMixin, quesResultMixin], // 题块部分逻辑写在mixin 与补录图片部分功能一致
  data() {
    return {
      examId: '',
      paperId: '',
      quesList: [],
      subQuesList: [],
      examTime: 0, // 考试时长
      timeDownStart: false, // 倒计时开始
      lessTime: false, // 没有时间了
      showDialog: false,
      curQuesContent: '',
      areaImgList: [], // 题块对应图片集合
      areaQuesMap: {}, // 题块对应的组卷geneId数组
      cropperShow: false, // 切图框显示隐藏
      imageUrl: '', // file上传后的image路径
      areaIndex: -1, // 当前题块索引
      timeOverShow: false,
      timeOverUrl: examOverIcon,
      submitLoading: false, // 交卷loading
      audioUrl: '' // 英语听力
    }
  },
  computed: {
    ...mapState('exam', [
      'playingState'
    ])
  },
  created() {
    this.examId = this.$route.query.examId
    this.paperId = this.$route.query.paperId
    this.subName = this.$route.query.subName
    if (this.examId && this.paperId) {
      this.initQuesList()
      this.initAreaImage()
      if (this.playingState) {
        this.setPlayingState(!this.playingState)
      }
    }
  },
  methods: {
    ...mapActions('exam', [
      'setPlayingState'
    ]),
    async initQuesList() {
      let quesListResult
      try {
        quesListResult = await this.apiGetCdnPaperQuesList(this.paperId) // cdn数据
      } catch (err) {
        quesListResult = await this.apiGetPaperQuesList(this.examId, this.paperId) // 服务器数据
      }

      const { success, eExamPaperlist } = quesListResult
      const paperConfigResult = await this.apiGetPaperInfo(this.examId, this.paperId)
      const { paperStuInfoVo, beginTimes } = paperConfigResult

      if (success) {
        this.timeCountDown(paperStuInfoVo, beginTimes)

        const retQuesList = eExamPaperlist || []
        if (retQuesList.length === 0) {
          return
        }
        this.audioUrl = paperStuInfoVo.musicUrl || ''
        this.normalizeQuesList(retQuesList)
      } else {
        // error log
        this.$notify({
          message: '试题获取失败，稍后重试',
          type: 'danger'
        })
      }
    },
    initAreaImage() {
      this.apiGetQuesAreaImgList(this.examId, this.paperId, this.subName).then(res => {
        const { success, data } = res
        if (success) {
          const areaList = data || []
          const imageList = this.getLocalImageList()
          const deletable = true // 非服务器图片
          this.normalizeAreaList(areaList, imageList, deletable)
          this.$nextTick(() => {
            this.$refs.bsContent && this.$refs.bsContent.refresh()
          })
        } else {
          // error log
          this.$notify({
            message: '试题信息获取失败，稍后重试',
            type: 'danger'
          })
        }
      })
    },
    timeCountDown(paperStuInfoVo, beginTimes) {
      const { beginExamStr, endExamStr, curExamStr, examLast, checkExam } = paperStuInfoVo
      const setBeginTime = new Date(beginExamStr.replace(/-/g, '/'))
      const startTime = new Date(parseInt(beginTimes))
      // let examLength = paperStuInfoVo.examLength // 读科目配置的答题时间
      const endTime = new Date(endExamStr.replace(/-/g, '/'))
      const curTime = new Date(curExamStr.replace(/-/g, '/'))
      if (checkExam && checkExam === 1) {
        // 允许答题
        if (examLast !== null) {
          // examLength = paperStuInfoVo.examLast
          this.examTime = (endTime - curTime)
          this.timeDownStart = true
          this.$refs.countDown.reset()
        }
      } else if (startTime < setBeginTime) {
        this.$dialog.alert({
          message: '还没到答题时间哟！'
        }).then(() => {
          this.$router.go(-1)
        })
        return
      } else {
        this.examTime = (endTime - curTime)
        if (this.examTime < 0) {
          this.timeOverShow = true
        }
        return
      }
    },
    // 倒计时结束
    timeDownFinish() {
      if (this.timeDownStart) {
        this.timeOverShow = true
      }
    },
    // 倒计时变化
    timeDownChange(timeData) {
      if (this.timeDownStart && timeData.minutes <= 15 && timeData.hours === 0) {
        this.lessTime = true
      }
    },
    // 点击题号显示题目详情
    showDetail(ques) {
      this.curQuesContent = ques.quesTitle
      this.showDialog = true
    },
    // 格式化接口返回试题list
    normalizeQuesList(retQuesList) {
      const allQuesArr = []
      for (let i = 0; i < retQuesList.length; i++) {
        const quesVo = retQuesList[i]
        const { quesTitle, quesMold, quesId, quesNo, quesType, quesParent, gQIId } = quesVo
        if (!quesTitle) {
          continue
        }

        const newQuesVo = {
          quesType: quesType,
          quesTitle: quesTitle,
          choiceTextArr: [],
          quesMold: quesMold,
          quesId: quesId,
          quesNo: quesNo,
          quesParent: quesParent,
          geneId: gQIId,
          answer: ''
        }

        // 如果是选择题 格式化题干内容
        if (quesTitle && quesTitle.indexOf('<choice class=') !== -1) {
          const quesTitleObj = normalizeChoicesQues(newQuesVo.quesTitle)
          newQuesVo.choiceTextArr = quesTitleObj.choiceArr
          const contentArr = quesTitleObj.content // 两层数组
          let titleStr = ''
          let index = 1
          for (const contentItemArr of contentArr) {
            for (const citem of contentItemArr) {
              const type = citem.type
              const content = citem.cont
              if (index === 1) {
                titleStr += `${newQuesVo.quesNo}.${content}`
              } else {
                if (type === 'text') {
                  titleStr += `<p>${content}<p>`
                } else {
                  titleStr += content
                }
              }
              index++
            }
          }
          newQuesVo.quesTitle = titleStr

          // 如果是多选题将答案设置为数组
          if (quesType === '多选题') {
            newQuesVo.answer = []
          }

          let localResult = {}
          if (this.onlineQuesMap[this.paperId]) {
            localResult = this.onlineQuesMap[this.paperId]
            if (localResult.userId === this.userId) {
              const quesAnswerMap = localResult.quesAnswerMap
              if (quesAnswerMap && quesAnswerMap[newQuesVo.quesId]) {
                this.$set(newQuesVo, 'answer', quesAnswerMap[newQuesVo.quesId])
              }
            }
          }
        }
        allQuesArr.push(newQuesVo)
      }
      this.quesList = allQuesArr.filter(ques => {
        return ques.choiceTextArr.length > 0
      })

      this.subQuesList = allQuesArr.filter(ques => {
        return ques.choiceTextArr.length === 0
      })
    },
    beforeDelete(file) {
    },
    onChange() {
    },
    // 交卷
    submitAnswer(submitType) {
      const choiceArr = []
      this.quesList.forEach(choice => {
        let newAnswer = Object.assign({}, choice.answer)
        if (choice.quesType === '多选题') {
          newAnswer = newAnswer.toString()
        }
        if (newAnswer.length > 0) {
          choiceArr.push({
            quesId: choice.quesId,
            answer: newAnswer,
            geneId: choice.geneId
          })
        }
      })

      let noDataIndex = 0
      for (const ques of this.quesList) {
        if (!this.calcChoiceChecked(ques)) {
          noDataIndex++
        }
      }

      const imageArr = []
      this.areaImgList.forEach(area => {
        let orderNum = 1
        if (area.imageList.length > 0) {
          area.imageList.forEach(imgItem => {
            imageArr.push({
              imgPath: imgItem.url,
              orderNum: orderNum,
              geneIds: [],
              areaId: area.id
            })
            orderNum++
          })
        } else {
          noDataIndex++
        }
      })

      const submitData = {
        examId: this.examId,
        pqList: choiceArr,
        images: imageArr
      }

      if (noDataIndex !== 0 && submitType !== 'force') {
        this.$dialog.confirm({
          title: '交卷提示',
          message: '有部分题目没有作答，确认交卷吗'
        }).then(() => {
          // on confirm
          this.confirmSubmit(submitData)
        }).catch(() => {
          // on cancel
        })
      } else {
        this.confirmSubmit(submitData)
      }
    },
    calcChoiceChecked(ques) {
      let ret = false
      if ((ques.quesType === '单选题' && ques.answer !== '') || (ques.quesType === '多选题' && ques.answer.length !== 0)) {
        ret = true
      }
      return ret
    },
    // 确认交卷
    confirmSubmit(submitData) {
      this.apiSavePaperQuesResult(submitData, this.paperId).then(res => {
        const { success } = res
        if (success === 'success') {
          this.$notify({
            message: '提交成功',
            type: 'success'
          })
          this.$router.go(-1)
        } else {
          this.$notify({
            message: '提交失败',
            type: 'danger'
          })
        }
      })
    },
    // 开始播放音频
    startPlay() {
      this.setPlayingState(!this.playingState)
    },
    apiGetQuesAreaImgList(examId, paperId) {
      return new Promise((resolve, reject) => {
        getSubjectAreaList(examId, paperId).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetCdnPaperQuesList(paperId) {
      return new Promise((resolve, reject) => {
        getCdnPaperQuesList(paperId).then(res => {
          resolve(res.data)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },
    apiGetPaperQuesList(examId, paperId) {
      return new Promise((resolve, reject) => {
        getPaperQuesInfoList(examId, paperId).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetPaperInfo(examId, paperId) {
      return new Promise((resolve, reject) => {
        getPaperInfo(examId, paperId).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiSavePaperQuesResult(data, paperId) {
      return new Promise((resolve, reject) => {
        savePaperQuesResult(data, paperId).then(res => {
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
  height: calc(100vh - 90px);
  overflow: hidden;
}
.content-container{
  background: #fff;
  .space-class{
    justify-content: flex-start;
    padding: 0 10px;
  }
}
.entry-wrap{
  padding-bottom: 55px;
}
.english-audio-wrap {
  display: flex;
  align-items: center;
  padding: 0 14px;
  box-sizing: border-box;
  .play-btn{
    margin-right: 10px;
    ::v-deep .van-icon{
      vertical-align: middle;
    }
  }
}
.entry-table{
  text-align: center;
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  tbody{
    tr{
      background: #fff;
      border-bottom: 1px solid #4381E5;
      &:nth-child(odd) {
        border-top: 1px solid #4381E5;
        background: #E5EFFF;
      }
      .ques-no{
        font-size: 16px;
        color: #4381E5;
        padding: 0 5px;
      }
    }
  }
  th{
    height: 32px;
    text-align: center;
    color: #ff6347;
    &:nth-child(1){
      width: 15%;
    }
    &:nth-child(2){
      width: 15%;
    }
    &:nth-child(3){
      width: 70%;
    }
  }
  td{
    height: 38px;
    padding: 0 2px;
    line-height: 1.4;
    color: #4e565f;
  }
}
.check-icon{
  display: block;
  width: 30px;
  height: 18px;
  line-height: 18px;
  font-size: 12px;
  text-align: center;
  // border-radius: 50%;
  color: #4e565f;
  border: 1px solid #4e565f;
  &.active{
    color: #fff;
    background: #4e565f;
  }
}
.submit-btn{
  position: fixed;
  bottom: 0;
  left: 0;
}
.ques-dialog{
  .dialog-wrapper{
    position: relative;
    top: 5%;
    margin: auto;
    height: 90%;
    width: 90%;
    background-color: #fff;
    border-radius: 5px;
    .close-btn{
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
  .ques-content{
    padding: 30px 10px 10px;
    text-align: justify;
    color: #4e565f;
    font-size: 14px;
  }
}
.upload-wrap{
  padding: 0 14px;
  .area-title{
    padding: 8px 0;
    font-size: 14px;
    color: #000;
  }
}
.time-over-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .content {
    width: 80%;
    height: 240px;
    margin: auto;
    background-color: #fff;
    border-radius: 5px;
    .title{
      text-align: center;
      color: #f00;
      font-weight: 500;
    }
    .image-wrap{
      width: 130px;
      margin: auto;
      img{
        width: 100%;
        height: auto;
      }
    }
    .btn-row{
      margin-top: 30px;
      text-align: center;
      ::v-deep .van-button{
        width: 200px;
        height: 32px;
      }
    }
  }
}
.white-count-down{
  height: 46px;
  line-height: 46px;
  padding-right: 14px;
  color: #fff;
  &.lesstime{
    font-size: 20px;
    color: #ff6347;
  }
}

.right-wrap{
  display: flex;
  align-items: center;
  padding-right: 14px;
  justify-content: flex-end;
  box-sizing: border-box;
  .play-btn{
    margin-right: 10px;
    ::v-deep .van-icon{
      vertical-align: middle;
    }
  }
}
</style>
