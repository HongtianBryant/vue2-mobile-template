<template>
  <div class="page-container">
    <page-header title="补录答案" right-text="提交图片" @clickRight="submitImages"></page-header>
    <base-scroll class="scroll-wrapper" :data="areaImgList">
      <div class="upload-wrap">
        <div v-for="(area, index) in areaImgList" :key="area.id" class="area-cell">
          <div class="area-title">题号：{{ area.quesNoText }}</div>
          <van-uploader v-model="area.imageList" :name="index" :before-read="beforeRead" :after-read="afterRead(area)"></van-uploader>
        </div>
      </div>
    </base-scroll>
    <image-cropper
      :cropper-show="cropperShow"
      :image-url="imageUrl"
      @hideModal="hideCropper"
      @submitImage="submitImage"
    ></image-cropper>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import ImageCropper from '@/components/ImageCropper'
import BaseScroll from '@/components/BaseScroll'
import { getQuesAreaImgList, savePaperQuesImg } from '@/api/exam'
import { quesAreaImageMixin } from '@/common/js/mixins'

export default {
  name: 'OnlinePaperQues',
  components: {
    PageHeader,
    ImageCropper,
    BaseScroll
  },
  mixins: [quesAreaImageMixin], // 题块部分逻辑写在mixin 与录答案页面 题块上传部分功能一致
  data() {
    return {
      areaImgList: [], // 题块对应图片集合
      areaQuesMap: {}, // 题块对应的组卷geneId数组
      curPath: '',
      cropperShow: false,
      imageUrl: '',
      areaIndex: -1,
      addImage: true
    }
  },
  created() {
    this.examId = this.$route.query.examId
    this.paperId = this.$route.query.paperId
    this.subName = this.$route.query.subName
    if (this.examId && this.paperId) {
      this.initAreaQues()
    }
  },
  methods: {
    initAreaQues() {
      this.apiGetQuesAreaImgList(this.examId, this.paperId, this.subName).then(res => {
        const { success, data } = res
        if (success) {
          const areaList = data.areas || []
          const imageList = data.images || []
          const deletable = false // 服务器图片不可以删除
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
    // 提交所有试题图片
    submitImages() {
      const newImageArr = []
      for (const areaObj of this.areaImgList) {
        const imageArr = areaObj.imageList
        let orderNum = 1
        for (const imageObj of imageArr) {
          if (imageObj.deletable) {
            newImageArr.push({
              imgPath: imageObj.url,
              orderNum: orderNum,
              areaId: imageObj.areaId
            })
          }
          orderNum++
        }
      }

      if (newImageArr.length === 0) {
        this.$notify({
          message: '没有新增试题图片',
          type: 'warning'
        })
        return
      }
      const paperInfo = {
        examId: this.examId,
        images: newImageArr
      }
      this.apiSavePaperQuesImg(paperInfo, this.paperId).then(res => {
        const { success } = res
        if (success) {
          this.$notify({
            message: '图片添加成功',
            type: 'success'
          })
          this.resetImageState()
        } else {
          this.$notify({
            message: '图片添加失败',
            type: 'danger'
          })
        }
      })
    },
    resetImageState() {
      for (const areaObj of this.areaImgList) {
        const imageArr = areaObj.imageList
        for (const imageObj of imageArr) {
          imageObj.deletable = false
        }
      }
    },
    apiGetQuesAreaImgList(examId, paperId, subName) {
      return new Promise((resolve, reject) => {
        getQuesAreaImgList(examId, paperId, subName).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiSavePaperQuesImg(pInfo, paperId) {
      return new Promise((resolve, reject) => {
        savePaperQuesImg(pInfo, paperId).then(res => {
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
.upload-wrap{
  padding: 0 14px;
  .area-title{
    padding: 8px 0;
    font-size: 14px;
    color: #000;
  }
}
</style>
