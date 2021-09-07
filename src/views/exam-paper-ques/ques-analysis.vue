<template>
  <div class="page-container">
    <div class="header-nav">
      <div class="nav-title" @click="showSheetCard">
        <span class="cur-qno">{{ currentQuesNo }}</span>
        <span class="last-qno">/{{ lastQuesNo }}</span>
      </div>
      <div class="count-down-wrap">
      </div>
    </div>
    <div class="ques-type-title">
      <div class="title-text">{{ quesTypeTitle }}</div>
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
              :choice-tap="false"
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
                  :choice-tap="false"
                  ques-level="child"
                ></ques-content>
              </swiper-slide>
            </swiper>
          </div>
        </swiper-slide>
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
        </swiper-slide>
      </swiper>
    </div>
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
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import 'katex/dist/katex.min.css'
import renderMathInElement from 'katex/dist/contrib/auto-render.js'
import mhchem from 'katex/dist/contrib/mhchem.js'
import QuesContent from './components/QuesContent'
import { quesAreaImageMixin, quesResultMixin } from '@/common/js/mixins'
import { normalizeChoicesQues } from '@/common/js/normalize'
import { getPaperQuesAnalysisList, getSubjectAreaList } from '@/api/exam'
import dragIcon from '@/assets/exam/drag-icon.png'

const QUES_TYPE_DESC = 0 // 试题类型描述
const QUES_TYPE_QUES = 1 // 具体题目
const QUES_TYPE_PARENT = 2 // 父级题 带有子题

export default {
  name: 'OnlinePaperQues',
  components: {
    Swiper,
    SwiperSlide,
    QuesContent
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
      areaImgList: [], // 题块对应图片集合
      areaQuesMap: {}, // 题块对应的组卷geneId数组
      areaIndex: -1,
      dragIconUrl: dragIcon,
      touchConfig: {} // 拖动改变子题高度 touch配置
    }
  },
  created() {
    this.examId = this.$route.query.examId
    this.paperId = this.$route.query.paperId
    if (this.examId && this.paperId) {
      this.initQuesList()
      this.initAreaQues()
    }
  },
  methods: {
    initQuesList() {
      this.apiGetPaperQuesList(this.examId, this.paperId).then(res => {
        const { success, eExamPaperlist } = res
        if (success) {
          const quesList = eExamPaperlist || []

          if (quesList.length === 0) {
            return
          }

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
      })
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
          const deletable = false // 非服务器图片
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
    apiGetPaperQuesList(examId, paperId) {
      return new Promise((resolve, reject) => {
        getPaperQuesAnalysisList(examId, paperId).then(res => {
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
