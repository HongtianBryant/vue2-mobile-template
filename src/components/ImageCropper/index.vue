<template>
  <div v-show="cropperShow" class="image-cropper">
    <div class="cropper-content">
      <vue-cropper
        ref="cropper"
        :img="option.img"
        :output-size="option.outputSize"
        :output-type="option.outputType"
        :info="true"
        :full="option.full"
        :can-move="option.canMove"
        :can-move-box="option.canMoveBox"
        :fixed="option.fixed"
        :fixed-box="option.fixedBox"
        :original="option.original"
        :auto-crop="option.autoCrop"
        :auto-crop-width="option.autoCropWidth"
        :auto-crop-height="option.autoCropHeight"
        :center-box="option.centerBox"
        :high="option.high"
        :fixed-number="option.fixedNumber"
        :info-true="option.infoTrue"
        :enlarge="option.enlarge"
      ></vue-cropper>
    </div>
    <!-- <div v-show="fileLoading" class="u-loading">
      <van-loading type="spinner" vertical color="#000">
      </van-loading>
    </div> -->
    <div class="modal-footer">
      <div class="confirm-btn" @click="finishCut">
        <van-icon v-show="!showBtnLoading" name="success"></van-icon>
        <van-loading v-show="showBtnLoading" type="spinner" vertical color="#fff"></van-loading>
      </div>
      <div class="cancel-btn" @click="hideModal">
        <van-icon name="cross"></van-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'

export default {
  name: 'ImageCropper',
  components: {
    VueCropper
  },
  props: {
    cropperShow: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: ''
    },
    showBtnLoading: {
      type: Boolean,
      default: false
    },
    fileLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      option: {
        img: '', // 裁剪图片的地址
        outputSize: 1, // 裁剪生成图片的质量 根据原图动态配置图片质量
        original: false, // 上传图片按照原始比例渲染
        full: false, // 输出原图比例截图 props名full
        outputType: 'png', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        canMove: false, // 上传图片是否可以移动
        canMoveBox: true, // 截图框能否拖动
        fixedBox: false, // 固定截图框大小 不允许改变
        autoCrop: true, //    是否默认生成截图框
        fixed: false, // 是否开启截图框宽高固定比例
        // fixedNumber: [16, 9], // 截图框的宽高比例
        centerBox: true, // 截图框是否被限制在图片里面
        high: true, // 是否按照设备的dpr 输出等比例图片
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        enlarge: 1, // 图片根据截图框输出比例倍数
        maxImgSize: 1000 // 限制图片最大宽度和高度
      },
      loading: false
    }
  },
  watch: {
    imageUrl(val) {
      this.option.img = val
    }
  },
  created() {
    this.option.img = this.imageUrl
  },
  methods: {
    hideModal() {
      this.$emit('hideModal')
    },
    finishCut() {
      this.$refs.cropper.getCropBlob((data) => {
        this.$emit('submitImage', data)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.image-cropper{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 9999;
}
.cropper-content{
  width:100vw;
  height:100vh;
  display: inline-block;
  position: relative;
}
.u-loading{
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  ::v-deep .van-loading{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -15px;
    margin-top: -15px;
  }
}
.modal-footer{
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  height: 40px;
  text-align: center;
  .confirm-btn{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    text-align: center;
    margin: auto;
    background: cornflowerblue;
    color: #fff;
    font-size: 32px;
  }
  .cancel-btn{
    position: absolute;
    right: 10px;
    top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    margin: auto;
    background: #4e6d5f;
    color: #fff;
    font-size: 20px;
  }
}
::v-deep .crop-point {
  background-color: transparent;
}
::v-deep .point1{
  top: -1px;
  left: -1px;
  border-top: 3px solid #39f;
  border-left: 3px solid #39f;
  border-radius: 0;
  opacity: 1;
}
::v-deep .point3{
  top: -1px;
  right: -1px;
  border-top: 3px solid #39f;
  border-right: 3px solid #39f;
  border-radius: 0;
  opacity: 1;
}
::v-deep .point6{
  bottom: -1px;
  left: -1px;
  border-bottom: 3px solid #39f;
  border-left: 3px solid #39f;
  border-radius: 0;
  opacity: 1;
}
::v-deep .point8{
  bottom: -1px;
  right: -1px;
  border-bottom: 3px solid #39f;
  border-right: 3px solid #39f;
  border-radius: 0;
  opacity: 1;
}

</style>
