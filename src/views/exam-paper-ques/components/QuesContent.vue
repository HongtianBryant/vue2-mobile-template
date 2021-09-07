<template>
  <div class="ques-container">
    <div class="ques-content" v-html="quesObj.quesTitle"></div>
    <div v-if="quesObj.choiceTextArr.length > 0" class="choice-wrap">
      <div v-if="quesObj.quesType === '单选题'">
        <van-radio-group
          v-model="quesObj.answer"
          direction="horizontal"
          :disabled="!choiceTap"
          @change="changeAnswer"
        >
          <van-radio
            v-for="choiceObj in quesObj.choiceTextArr"
            :key="quesObj.quesId+choiceObj.choice"
            :name="choiceObj.choice"
            icon-size="30"
          >
            <div class="content" v-html="choiceObj.cont"></div>
            <template #icon="props">
              <span class="check-icon-radio" :class="{'active': props.checked }">{{ choiceObj.choice }}</span>
            </template>
          </van-radio>
        </van-radio-group>
      </div>
      <div v-else-if="quesObj.quesType === '多选题'">
        <van-checkbox-group
          v-model="quesObj.answer"
          direction="horizontal"
          :disabled="!choiceTap"
          @change="changeAnswer"
        >
          <van-checkbox
            v-for="choiceObj in quesObj.choiceTextArr"
            :key="quesObj.quesId+choiceObj.choice"
            :name="choiceObj.choice"
            icon-size="30"
          >
            <div class="content" v-html="choiceObj.cont"></div>
            <template #icon="props">
              <span class="check-icon-checkbox" :class="{'active': props.checked }">{{ choiceObj.choice }}</span>
            </template>
          </van-checkbox>
        </van-checkbox-group>
      </div>
    </div>
    <div v-if="showOperationBtn" class="ques-img-wrap">
      <div class="btn-wrap">
        <van-button type="info" size="small" @click="showUploadImage">现在上传答案</van-button>
        <!-- <van-button type="info" size="small" @click="slideNext(quesObj.quesParent)">继续下一题，稍后一并上传</van-button> -->
      </div>
      <div class="image-list">
        <van-uploader
          v-model="quesObj.imageList"
          :name="quesObj.quesId"
          :before-delete="delFromQuesBottom"
        ></van-uploader>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'QuesContent',
  props: {
    quesObj: {
      type: Object,
      default() {
        return {}
      }
    },
    quesLevel: {
      type: String,
      default: ''
    },
    choiceTap: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    showOperationBtn() {
      return this.quesObj.choiceTextArr.length === 0 && this.quesObj.quesMold === 1 && this.choiceTap
    }
  },
  methods: {
    showUploadImage() {
      this.$emit('showUploadImage')
    },
    slideNext(quesParent) {
      this.$emit('slideNext', quesParent)
    },
    changeAnswer() {
      this.$emit('changeChoiceAnswer')
    },
    delFromQuesBottom(file) {
      this.$emit('delFromQuesBottom', file)
    }
  }
}
</script>
<style lang='scss' scoped>
.ques-container{
  min-height: calc(50vh - 40px);
  background-color: #fff;
  overflow: auto;
  .ques-img-wrap{
    .image-list{
      padding: 14px;
    }
    ::v-deep .van-uploader__preview{
      border: 1px solid #ccc;
    }
    ::v-deep .van-uploader__upload{
      display: none;
    }
    padding-bottom: 40px;
  }
}
.ques-content{
  font-size: 14px;
  color: #4e565f;
  padding: 10px 14px;
  line-height: 1.6;
}
.choice-wrap{
  font-size: 14px;
  color: #4e565f;
  padding: 10px 14px;
}
.check-icon-radio{
  display: block;
  width: 30px;
  height: 30px;
  line-height: 28px;
  font-size: 16px;
  text-align: center;
  border-radius: 50%;
  color: #4381E5;
  border: 1px solid #4381E5;
  &.active{
    color: #fff;
    background: #4381E5;
  }
}
.check-icon-checkbox{
  display: block;
  width: 30px;
  height: 30px;
  line-height: 28px;
  font-size: 16px;
  text-align: center;
  border-radius: 5px;
  color: #4381E5;
  border: 1px solid #4381E5;
  &.active{
    color: #fff;
    background: #4381E5;
  }
}
.btn-wrap{
  display: flex;
  padding: 0 14px 10px;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
}
::v-deep .van-radio--horizontal{
  width: 100%;
  margin-bottom: 12px;
  box-sizing: border-box;
}
::v-deep .van-checkbox--horizontal{
  width: 100%;
  margin-bottom: 12px;
  box-sizing: border-box;
}
::v-deep .van-radio__label--disabled {
  color: #323233;
  opacity: 0.8;
}
::v-deep .van-radio__icon--disabled{
  opacity: 0.8;
}
</style>
