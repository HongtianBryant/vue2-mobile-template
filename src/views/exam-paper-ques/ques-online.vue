<template>
  <div class="page-container">
    <div class="header-nav">
      <div class="nav-title" @click="showSheetCard">
        <span class="cur-qno">{{ currentQuesNo }}</span>
        <span class="last-qno">/{{ lastQuesNo }}</span>
      </div>
      <div class="count-down-wrap">
        <van-count-down
          ref="countDown"
          :class="{lesstime: lessTime}"
          :time="examTime"
          format="HH:mm:ss"
          @finish="timeDownFinish"
          @change="timeDownChange"
        >
        </van-count-down>
      </div>
    </div>
    <div class="ques-type-title">
      <div class="title-text">{{ quesTypeTitle }}</div>
      <div v-if="audioUrl" class="right-wrap">
        <div class="play-btn" @click="startPlay">
          <van-icon v-if="!playingState" name="play-circle-o" size="24"></van-icon>
          <van-icon v-else-if="playingState" name="pause-circle-o" size="24"></van-icon>
        </div>
        <audio-player :paper-id="paperId" :audio-url="audioUrl"></audio-player>
      </div>
    </div>
    <div v-if="quesList.length === 0" class="loading-wraper">
      <van-loading type="spinner" vertical color="#1989fa">
        试题加载中...
      </van-loading>
    </div>
    <div v-if="quesList.length > 0" ref="quesContent" class="ques-wrapper">
      <swiper
        ref="mainSwiper"
        :auto-update="false"
        :delete-instance-on-destroy="true"
        :cleanup-styles-on-destroy="true"
        :options="swiperOptions"
        @slideChangeTransitionEnd="mainSlideChangeEnd"
      >
        <swiper-slide v-for="ques in quesList" :key="ques.quesId">
          <div :ref="ques.geneId" class="main-wrap" :class="{'has-child': ques.childQuesList}">
            <ques-content
              :ques-obj="ques"
              @showUploadImage="showUploadImage"
              @slideNext="slideNext"
              @changeChoiceAnswer="changeChoiceAnswer"
              @delFromQuesBottom="delFromQuesBottom"
            ></ques-content>
          </div>
          <div v-if="ques.childQuesList" :ref="ques.quesId" class="child-wrap">
            <div
              class="drag-btn"
              :style="{backgroundImage: `url(${dragIconUrl})`}"
              @touchstart.prevent="dragTouchStart"
              @touchmove.prevent="dragTouchMove"
              @touchend="dragTouchEnd"
            >
            </div>
            <swiper
              ref="childSwiper"
              :auto-update="false"
              :delete-instance-on-destroy="true"
              :cleanup-styles-on-destroy="true"
              :options="childSwiperOptions"
              @slideChangeTransitionEnd="childSlideChangeEnd"
            >
              <swiper-slide v-for="childQues in ques.childQuesList" :key="childQues.quesId">
                <ques-content
                  :ques-obj="childQues"
                  ques-level="child"
                  @showUploadImage="showUploadImage"
                  @slideNext="slideNext"
                  @changeChoiceAnswer="changeChoiceAnswer"
                  @delFromQuesBottom="delFromQuesBottom"
                ></ques-content>
              </swiper-slide>
            </swiper>
          </div>
        </swiper-slide>
        <!-- 最后一页答题卡 -->
        <swiper-slide>
          <div class="type-cells">
            <div v-for="(typeList, key, index) in typeMap" :key="index" class="type-cell">
              <div class="title">
                <van-divider :style="dividerSty">{{ key }}</van-divider>
              </div>
              <div class="ques-circles">
                <div
                  v-for="ques in typeList"
                  :key="ques.geneId"
                  class="ques-circle"
                  @click="showQuesSlide(ques.quesId, ques.quesParent)"
                >
                  <label class="q-no" :class="{'active': calcChecked(ques)}">{{ ques.fullNo }}</label>
                </div>
              </div>
            </div>
          </div>
          <van-button
            class="submit-btn"
            color="#4381E5"
            type="primary"
            block
            :loading="submitLoading"
            loading-text="提交中..."
            @click="submitAnswer"
          >交卷</van-button>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 上传主观题图片 -->
    <div v-show="quesImgsShow" class="ques-imgs-wrapper">
      <div class="modal-header">
        <div class="left" @click="quesImgsShow = false">
          返回
        </div>
        <div class="h-title">题目图片上传</div>
        <div class="right" @click="saveUploadImage">
          保存图片
        </div>
      </div>
      <div class="upload-wrap">
        <base-scroll ref="imageScorll" class="scroll-wrapper" :data="areaImgList">
          <div class="area-cells">
            <div v-for="(area, index) in areaImgList" :key="area.id" class="area-cell">
              <div class="area-title">题号：{{ area.quesNoText }}</div>
              <van-uploader
                v-model="area.imageList"
                :name="index"
                :before-read="beforeRead"
                :after-read="afterRead(area)"
                :before-delete="delFromCard"
                @delete="delImage"
              ></van-uploader>
            </div>
          </div>
        </base-scroll>
      </div>
    </div>
    <!-- 考试结束提示框 -->
    <van-overlay :show="timeOverShow" style="z-index: 3">
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
    <!-- 图片切图 -->
    <image-cropper
      ref="cropper"
      :cropper-show="cropperShow"
      :image-url="imageUrl"
      :show-btn-loading="imageUploading"
      :file-loading="fileLoading"
      @hideModal="hideCropper"
      @submitImage="submitImage"
    ></image-cropper>
    <div v-show="quesList.length > 0 && !isLastSlide" class="swiper-navigation">
      <div class="prev-el" @click="quesPrev">
        <svg-icon icon-class="slide-prev"></svg-icon>
      </div>
      <div class="next-el" @click="quesNext">
        <svg-icon icon-class="slide-next"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import 'katex/dist/katex.min.css'
import renderMathInElement from 'katex/dist/contrib/auto-render.js'
import mhchem from 'katex/dist/contrib/mhchem.js'
import ImageCropper from '@/components/ImageCropper'
import BaseScroll from '@/components/BaseScroll'
import QuesContent from './components/QuesContent'
import AudioPlayer from './components/AudioPlayer'
import { quesAreaImageMixin, quesResultMixin } from '@/common/js/mixins'
import { normalizeChoicesQues } from '@/common/js/normalize'
import { getPaperQuesInfoList, getPaperInfo, getSubjectAreaList, savePaperQuesResult } from '@/api/exam'
import { getCdnPaperQuesList } from '@/api/cdn-exam'
import examOverIcon from '@/assets/exam/time-over.png'
import dragIcon from '@/assets/exam/drag-icon.png'

const QUES_TYPE_DESC = 0 // 试题类型描述
const QUES_TYPE_QUES = 1 // 具体题目
const QUES_TYPE_PARENT = 2 // 父级题 带有子题

export default {
  name: 'OnlinePaperQues',
  components: {
    Swiper,
    SwiperSlide,
    QuesContent,
    ImageCropper,
    AudioPlayer,
    BaseScroll
  },
  directives: {
    swiper: directive
  },
  mixins: [quesAreaImageMixin, quesResultMixin],
  data() {
    return {
      swiperOptions: {
        autoHeight: true,
        observer: true,
        observeParents: true,
        allowTouchMove: true
      },
      childSwiperOptions: {
        allowTouchMove: true
      },
      isLastSlide: false, // 是否为最后一题
      dividerSty: {
        color: '#323233',
        fontSize: '14px',
        borderColor: '#ddd'
      },
      examId: '',
      paperId: '',
      quesList: [], // 结构化后的数组
      quesNoMap: {}, // quesId对应的题号
      childSwiperIndexMap: {}, // 题目id对应的childlist的索引
      typeMap: {}, // 试题类型对应的试题list的对象
      examTime: 0, // 考试时长
      lessTime: false, // 没有时间了
      timeDownStart: false, // 倒计时开始
      currentQuesNo: '', // 当前题号
      lastQuesNo: '', // 最后一题题号
      quesTypeTitle: '说明', // 当前题目类型
      mainSlideIndex: 0, // 主滑动当前索引
      childSlideIndex: 0, // 子滑动当前索引
      childW: document.documentElement.clientWidth,
      childH: document.documentElement.clientHeight * 0.5 - 40,
      minW: document.documentElement.clientWidth,
      minH: 90,
      quesImgsShow: false, // 主观题图片
      timeOverShow: false, // 时间截止到时
      areaImgList: [], // 题块对应图片集合
      areaQuesMap: {}, // 题块对应的组卷geneId数组
      curPath: '', // 当前上传图片
      cropperShow: false,
      imageUrl: '',
      areaIndex: -1,
      timeOverUrl: examOverIcon,
      dragIconUrl: dragIcon,
      submitLoading: false, // 交卷loading
      audioUrl: '', // 英语听力
      touchConfig: {} // 拖动改变子题高度 touch配置
    }
  },
  computed: {
    ...mapState('exam', [
      'playingState',
      'currentAudio'
    ])
  },
  created() {
    this.examId = this.$route.query.examId
    this.paperId = this.$route.query.paperId
    if (this.examId && this.paperId) {
      this.initQuesList()
      this.initAreaQues()
      if (this.playingState) {
        this.setPlayingState(!this.playingState)
      }
    }
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.imageScorll && this.$refs.imageScorll.refresh()
    })
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
      if (success === 'success') {
        const quesList = eExamPaperlist || []
        this.timeCountDown(paperStuInfoVo, beginTimes)

        if (quesList.length === 0) {
          return
        }

        this.audioUrl = paperStuInfoVo.musicUrl || ''

        this.normalizeQuesList(quesList)
        // 显示题号和题型
        this.$nextTick(() => {
          this.showQuesNo()
        })

        // 公式解析
        this.$nextTick(() => {
          renderMathInElement(this.$refs.quesContent, {
            delimiters: [{ left: '$', right: '$', display: false }]
          })
        })
      } else {
        // error log
        this.$notify({
          message: '试题获取失败，稍后重试',
          type: 'danger'
        })
      }
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
    // 拖动改变高度 开始
    dragTouchStart(e) {
      e.preventDefault()
      const curTouch = e.targetTouches[0]
      this.touchConfig.initiated = true
      this.touchConfig.startX = curTouch.pageX
      this.touchConfig.startY = curTouch.pageY

      const parentQuesId = this.quesList[this.mainSlideIndex].quesId
      const parentGeneId = this.quesList[this.mainSlideIndex].geneId
      const aboveDiv = this.$refs[parentGeneId][0].clientHeight
      const belowDiv = this.$refs[parentQuesId][0].clientHeight
      this.touchConfig.aboveHeight = aboveDiv
      this.touchConfig.belowHeight = belowDiv
      e.stopProg
    },
    // 拖动改变高度 拖动中
    dragTouchMove(e) {
      const curTouch = e.targetTouches[0]
      const deltaX = curTouch.pageX - this.touchConfig.startX
      const deltaY = curTouch.pageY - this.touchConfig.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        const newAboveHt = this.touchConfig.aboveHeight + deltaY
        const newBelowHt = this.touchConfig.belowHeight - deltaY
        if (newAboveHt >= 0 && newAboveHt > 20) {
          this._offsetBelow(newBelowHt, newAboveHt)
        }
      }
    },
    dragTouchEnd() {
      // this.touchConfig.initiated = false
      const parentQues = this.quesList[this.mainSlideIndex]
      const swiperArr = this.$refs.childSwiper

      if (parentQues && parentQues.childQuesList && parentQues.childQuesList.length > 0) {
        const quesParent = parentQues.quesId
        const childSwiperInstance = swiperArr[this.childSwiperIndexMap[quesParent]]
        childSwiperInstance.$swiper.updateSize()
      }
    },
    _offsetBelow(newBelowHt, newAboveHt) {
      const parentQuesId = this.quesList[this.mainSlideIndex].quesId
      const parentGeneId = this.quesList[this.mainSlideIndex].geneId
      this.$refs[parentQuesId][0].style.height = `${newBelowHt}px`
      this.$refs[parentGeneId][0].style.height = `${newAboveHt}px`
    },
    // 初始化题块
    initAreaQues() {
      this.apiGetQuesAreaImgList(this.examId, this.paperId).then(res => {
        const { success, data } = res
        if (success) {
          const areaList = data || []
          const imageList = this.getLocalImageList()
          const deletable = true // 非服务器图片
          this.normalizeAreaList(areaList, imageList, deletable)
        } else {
          // error log
          this.$notify({
            message: '试题信息获取失败，稍后重试',
            type: 'danger'
          })
        }
      })
    },
    // 格式化接口返回试题list
    normalizeQuesList(quesList) {
      const retQuesList = []
      let childListIndex = 0
      for (let i = 0; i < quesList.length; i++) {
        const quesVo = quesList[i]
        const { quesTitle, typeDesc, quesMold, quesId, quesNo, fullNo, quesType, quesParent, gQIId } = quesVo
        const newQuesVo = {
          quesType: quesType, // 题目类型 如：单选题 多选题
          quesTitle: quesTitle, // 题干 包括题目说明非试题内容
          choiceTextArr: [], // 如果题目包含选项 将选项拆分为数组
          quesMold: quesMold, // 题目类型 0 1 2
          quesId: quesId,
          fullNo: fullNo,
          quesNo: quesNo, // 题号
          quesParent: quesParent, // 父级题id
          geneId: gQIId, // 组卷id
          answer: '' // 试题答案 前端用来提交用
        }
        this.quesNoMap[quesId] = quesNo
        // 如果是题目说明 非题干内容
        if (quesMold === QUES_TYPE_DESC) {
          newQuesVo.quesTitle = typeDesc
        }

        // 父级题
        if (quesMold === QUES_TYPE_PARENT) {
          this.childSwiperIndexMap[quesId] = childListIndex
          childListIndex++
        }

        // 如果是试题 创建 key: 题目类型  value: [quesobj, ...]
        if (quesMold === QUES_TYPE_QUES) {
          if (!this.typeMap[quesType]) {
            this.typeMap[quesType] = []
          }
          // 设置题号
          // if (newQuesVo.quesParent) {
          //   this.$set(newQuesVo, 'fullNo', `${this.quesNoMap[newQuesVo.quesParent]}${newQuesVo.quesNo}`)
          // } else {
          //   this.$set(newQuesVo, 'fullNo', `${newQuesVo.quesNo}`)
          // }
          this.typeMap[quesType].push(newQuesVo)
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
                titleStr += `${newQuesVo.quesNo}. ${content}`
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
        } else {
          if (newQuesVo.quesMold !== QUES_TYPE_DESC) { // 非选择题处理题号
            const newTitle = newQuesVo.quesTitle.replace(/<p> \s+|(&nbsp;)+ <\/p>/g, '') // 去除p标签之间的空格
            const pReg = /<(p|div)[\s\S]+?<\/(p|div)>|<(table)[\s\S]+?<\/(table)>/gi
            const replacePReg = /<(p|div)>|<\/(p|div)>/g
            const pArr = newTitle.match(pReg)
            if (pArr && pArr.length > 0) {
              const firstText = pArr[0].replace(replacePReg, '')
              const addQuesNoText = `${newQuesVo.quesNo}. ${firstText}`
              let newQuesTitle = addQuesNoText
              for (let i = 0; i < pArr.length; i++) {
                if (i === 0) {
                  continue
                }
                newQuesTitle += pArr[i]
              }
              newQuesVo.quesTitle = newQuesTitle
            }
            let localResult = {}
            if (this.onlineQuesMap[this.paperId]) {
              localResult = this.onlineQuesMap[this.paperId]
              if (localResult.userId === this.userId) {
                // 主观题图片
                const areaMap = localResult.areaMap
                if (areaMap && areaMap[newQuesVo.quesId]) {
                  this.$set(newQuesVo, 'imageList', areaMap[newQuesVo.quesId].imageList)
                }
              }
            }
          }
        }
        retQuesList.push(newQuesVo)
      }

      // 将选择题已经结构化后的结构父级题和子题拼接到一个数组
      this.combineChildQues(retQuesList)
    },
    /**
     * 根据父级题id将字体拼接到一个数组
     * */
    combineChildQues(retQuesList) {
      // 父级题id对应的子题数组map
      const childQuesMap = {}
      for (const ques of retQuesList) {
        if (ques.quesParent) {
          if (!childQuesMap[ques.quesParent]) {
            childQuesMap[ques.quesParent] = []
          }
          childQuesMap[ques.quesParent].push(ques)
        }
      }

      // 非子题： 整题或者题目说明
      const parentList = retQuesList.filter(item => {
        return item.quesParent === '' || item.quesParent === undefined || item.quesParent === null
      })

      // 计算当前子题数组是第几个 子滑动
      for (const ques of parentList) {
        if (ques.quesMold === QUES_TYPE_PARENT) {
          // ques.childQuesList = childQuesMap[ques.quesParent]
          this.$set(ques, 'childQuesList', childQuesMap[ques.quesId])
        }
      }

      // 最后一题题号
      const lastQues = parentList[parentList.length - 1]
      this.lastQuesNo = lastQues.fullNo
      if (lastQues.childQuesList && lastQues.childQuesList.length > 0) {
        this.lastQuesNo = lastQues.childQuesList[lastQues.childQuesList.length - 1].fullNo
      }
      this.quesList = parentList
    },
    // 主滑动 滑动结束事件
    mainSlideChangeEnd(swiper) {
      if (swiper.isEnd) {
        this.quesTypeTitle = '答题卡'
        this.isLastSlide = true
        return
      }
      this.isLastSlide = false
      this.mainSlideIndex = swiper.activeIndex
      this.showQuesNo()
    },
    // 子滑动 滑动结束事件
    childSlideChangeEnd(swiper) {
      this.childSlideIndex = swiper.activeIndex
      this.showQuesNo()
    },
    // 按钮 进入下一题
    slideNext(quesParent) {
      const swiperArr = this.$refs.childSwiper
      if (quesParent) {
        const childSwiperInstance = swiperArr[this.childSwiperIndexMap[quesParent]]
        if (childSwiperInstance.$swiper.isEnd) {
          this.$refs.mainSwiper.$swiper.slideNext()
          return
        }
        childSwiperInstance.$swiper.slideNext()
      } else {
        this.$refs.mainSwiper.$swiper.slideNext()
      }
    },
    // 上一题
    quesPrev() {
      const parentSwiper = this.$refs.mainSwiper.$swiper
      if (parentSwiper.isBeginning) {
        return
      }
      const swiperArr = this.$refs.childSwiper // 子滑动vueComponent数组
      const parentQues = this.quesList[this.mainSlideIndex]

      if (parentQues && parentQues.childQuesList && parentQues.childQuesList.length > 0) {
        const quesParent = parentQues.quesId
        const childSwiperInstance = swiperArr[this.childSwiperIndexMap[quesParent]]
        const childSwiper = childSwiperInstance.$swiper
        if (childSwiperInstance.$swiper.isBeginning) {
          this.$refs.mainSwiper.$swiper.slidePrev()
          return
        }
        childSwiper.slidePrev()
      } else {
        parentSwiper.slidePrev()
      }
    },
    // 下一题
    quesNext() {
      const parentSwiper = this.$refs.mainSwiper.$swiper
      if (parentSwiper.isEnd) {
        return
      }
      const swiperArr = this.$refs.childSwiper // 子滑动vueComponent数组
      const parentQues = this.quesList[this.mainSlideIndex]

      if (parentQues && parentQues.childQuesList && parentQues.childQuesList.length > 0) {
        const quesParent = parentQues.quesId
        const childSwiperInstance = swiperArr[this.childSwiperIndexMap[quesParent]]
        const childSwiper = childSwiperInstance.$swiper
        if (childSwiperInstance.$swiper.isEnd) {
          this.$refs.mainSwiper.$swiper.slideNext()
          return
        }
        childSwiper.slideNext()
      } else {
        parentSwiper.slideNext()
      }
    },
    // 显示题块图片上传列表
    showUploadImage() {
      this.quesImgsShow = true
      this.$nextTick(() => {
        this.$refs.imageScorll && this.$refs.imageScorll.refresh()
      })
    },
    // 显示答题卡 显示前重新赋值
    showSheetCard() {
      if (this.$refs.mainSwiper.isEnd) {
        return
      }
      const fullList = []
      for (const quesItem of this.quesList) {
        fullList.push(quesItem)
        const childQuesList = quesItem.childQuesList
        if (childQuesList) {
          for (const childQues of childQuesList) {
            fullList.push(childQues)
          }
        }
      }

      this.typeMap = {}
      for (const ques of fullList) {
        if (ques.quesMold === QUES_TYPE_QUES) {
          if (!this.typeMap[ques.quesType]) {
            this.typeMap[ques.quesType] = []
          }
          this.typeMap[ques.quesType].push(ques)
        }
      }

      this.$refs.mainSwiper.$swiper.slideTo(this.quesList.length, 0)
    },
    // 答题卡题目是否作答状态计算
    calcChecked(ques) {
      let ret = false
      if ((ques.quesType === '单选题' && ques.answer !== '') || (ques.quesType === '多选题' && ques.answer.length !== 0)) {
        ret = true
      } else if (ques.imageList && ques.imageList.length > 0) {
        ret = true
      }
      return ret
    },
    // 显示当前题号
    showQuesNo() {
      const curQues = this.quesList[this.mainSlideIndex]
      this.currentQuesNo = curQues.fullNo || '-'
      this.quesTypeTitle = curQues.quesType || '试题说明'
      const swiperArr = this.$refs.childSwiper // 子滑动vueComponent数组
      if (curQues.childQuesList) {
        const childSwiperInstance = swiperArr[this.childSwiperIndexMap[curQues.quesId]]
        const curChildIndex = childSwiperInstance.$swiper.activeIndex
        this.currentQuesNo = `${curQues.childQuesList[curChildIndex].fullNo}`
      }
    },
    // 答题卡 --点击跳转到试题页面
    showQuesSlide(quesId, quesParent) {
      let mainIndex = 0
      let childIndex = 0
      const swiperArr = this.$refs.childSwiper // 子滑动vueComponent数组
      if (quesParent) { // 有父级题的子题
        mainIndex = this.quesList.findIndex(ques => {
          return ques.quesId === quesParent
        })
        const childQuesList = this.quesList[mainIndex].childQuesList
        childIndex = childQuesList.findIndex(cques => {
          return cques.quesId === quesId
        })
      } else { // 非父级题
        mainIndex = this.quesList.findIndex(ques => {
          return ques.quesId === quesId
        })
        childIndex = -1
      }

      this.mainSlideIndex = mainIndex
      this.$refs.mainSwiper.$swiper.slideTo(mainIndex, 0)

      if (childIndex !== -1) {
        const childSwiperInstance = swiperArr[this.childSwiperIndexMap[quesParent]]
        childSwiperInstance.$swiper.slideTo(childIndex, 0)
      }
    },
    // 保存主观题图片
    saveUploadImage() {
      // let localResult = {}
      // if (this.onlineQuesMap[this.paperId]) {
      //   localResult = this.onlineQuesMap[this.paperId]
      //   if (localResult.userId !== this.userId) {
      //     localResult = {}
      //   }
      // }
      // const curQuesMap = {
      //   userId: this.userId,
      //   quesAnswerMap: localResult.quesAnswerMap,
      //   areaImgList: this.areaImgList
      // }
      // localResult[this.paperId] = curQuesMap
      // this.saveOnlineQuesMap(localResult)

      this.$notify({
        message: '图片保存成功',
        type: 'success'
      })
    },
    // 交卷按钮
    submitAnswer(submitType) {
      const choiceArr = [] // 选择题结果
      const choiceList = []

      for (const ques of this.quesList) {
        if (ques.choiceTextArr && ques.choiceTextArr.length > 0) {
          choiceList.push(ques)
        }
        if (ques.childQuesList && ques.childQuesList.length > 0) {
          for (const child of ques.childQuesList) {
            choiceList.push(child)
          }
        }
      }

      choiceList.forEach(choice => {
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

      const imageArr = [] // 已上传图片list
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
        }
      })
      const submitData = {
        examId: this.examId,
        pqList: choiceArr,
        images: imageArr
      }

      let noDataIndex = 0
      for (const key in this.typeMap) {
        const typeQuesList = this.typeMap[key]
        for (const ques of typeQuesList) {
          if (!this.calcChecked(ques)) {
            noDataIndex++
          }
        }
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
    // 确认交卷
    confirmSubmit(submitData) {
      this.submitLoading = true
      this.apiSavePaperQuesResult(submitData, this.paperId).then(res => {
        const { success } = res
        if (success === 'success') {
          this.timeOverShow = false
          this.$notify({
            message: '提交成功',
            type: 'success'
          })
          this.submitLoading = false
          this.$router.go(-1)
        } else {
          this.$notify({
            message: '提交失败',
            type: 'danger'
          })
          this.submitLoading = false
        }
      })
    },
    // 开始播放音频
    startPlay() {
      // if (this.currentAudio) {
      //   if (this.currentAudio.paperId === this.paperId && !this.currentAudio.canPlay) {
      //     this.$notify({
      //       message: '听力部分已结束',
      //       type: 'danger'
      //     })
      //     return
      //   }
      // }
      this.setPlayingState(!this.playingState)
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
    apiGetQuesAreaImgList(examId, paperId) {
      return new Promise((resolve, reject) => {
        getSubjectAreaList(examId, paperId).then(res => {
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
.header-nav{
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  background-color: #fff;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  .nav-title{
    width: 50%;
    position: relative;
    text-align: center;
    &::before{
      content: '';
      position: absolute;
      top: 8px;
      right: 0;
      height: 24px;
      width: 1px;
      background: #ccc;
    }
    .cur-qno{
      color: #4381E5;
      font-size: 18px;
    }
    .last-qno{
      color: #8d99a6;
      font-size: 14px;
    }
  }
  .count-down-wrap{
    width: 50%;
    text-align: center;
  }
}
.ques-type-title{
  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  background-color: #fff;
  border-bottom: 1px solid #4381E5;
  text-align: left;
  .title-text{
    border-left: 5px solid #4381E5;
    margin-left: 10px;
    padding-left: 6px;
    color: #4381E5;
    height: 20px;
    line-height: 20px;
    margin-top: 10px;
    width: 100px;
    flex: 0 0 100px;
  }
  .right-wrap{
    flex: 1;
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
}
.swiper-navigation{
  position: fixed;
  bottom: 30px;
  right: 20px;
  width: 80px;
  display: flex;
  justify-content: space-between;
  z-index: 2;
  .prev-el{
    // width: 40px;
    // flex: 0 0 40px;
    font-size: 30px;
  }
  .next-el{
    // width: 40px;
    // flex: 0 0 40px;
    font-size: 30px;
  }
}
.ques-wrapper{
  .main-wrap{
    background-color: #fff;
    height: calc(100vh - 82px);
    overflow: auto;
    &.has-child{
      height: calc(50vh - 41px);
        // overflow: hidden;
    }
  }
  .child-wrap{
    border-top: 1px solid #4381E5;
    position: relative;
    background-color: #fff;
    position: relative;
    height: calc(50vh - 41px);
    .ques-container{
      height: calc(50vh - 41px);
    }

  }
}

.loading-wraper{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  margin-left: -60px;
  margin-top: -60px;
}
.type-cells{
  height: calc(100vh - 124px);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  .type-cell{
    padding: 0 14px;
    margin-bottom: 15px;
    .title{
      margin-bottom: 8px;
    }
    .ques-circles{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .ques-circle{
        width: 20%;
        margin-bottom: 15px;
        .q-no{
          display: block;
          border: 2px solid #4381E5;
          width: 42px;
          height: 42px;
          line-height: 38px;
          box-sizing: border-box;
          border-radius: 50%;
          text-align: center;
          color: #000;
          font-size: 14px;
          margin: auto;
          font-weight: 400;
          &.active{
            color: #fff;
            background-color: #4381E5;
          }
        }
      }
    }
  }
}

.ques-imgs-wrapper{
  height: 100vh;
  width: 100vw;
  background: #fff;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  .modal-header{
    height: 40px;
    line-height: 40px;
    background: #4381E5;
    display: flex;
    .h-title{
      color: #fff;
      font-size: 14px;
      text-align: center;
      flex: 1;
    }
    .left{
      width: 80px;
      flex: 0 0 80px;
      color: #fff;
      font-size: 14px;
      padding-left: 14px;
      box-sizing: border-box;
    }
    .right{
      width: 80px;
      flex: 0 0 80px;
      color: #fff;
      font-size: 14px;
      text-align: right;
      padding-right: 14px;
      box-sizing: border-box;
    }
  }
  .upload-wrap{
    padding: 0 14px;
    .scroll-wrapper{
      height: calc(100vh - 40px);
      position: relative;
      overflow: hidden;
    }
    .area-title{
      padding: 8px 0;
      font-size: 14px;
      color: #000;
    }
  }
}

.hidden-hook{
  font-size: 10px;
  height: 10px;
  color: #fff;
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
.count-down-wrap{
  .lesstime{
    font-size: 20px;
    color: #ff6347;
  }
}
.drag-btn{
  position: absolute;
  height: 20px;
  width: 52px;
  margin: auto;
  right: 0;
  left: 0;
  top: -20px;
  background: #fff;
  background-size: 100%;
  background-repeat: no-repeat;
  img{
    width: 100%;
  }
}
</style>
