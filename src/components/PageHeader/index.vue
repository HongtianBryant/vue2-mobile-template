<!--
 * @Author: your name
 * @Date: 2021-02-19 20:04:34
 * @LastEditTime: 2021-03-09 16:27:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /online-exam/src/components/PageHeader/index.vue
-->
<template>
  <div class="header-title">
    <van-nav-bar
      :title="title"
      :left-text="leftText"
      :right-text="rightText"
      :left-arrow="leftArrow"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    ></van-nav-bar>
    <div class="f-right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderTitle',
  props: {
    title: {
      type: String,
      default: ''
    },
    leftText: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: ''
    },
    leftArrow: {
      type: Boolean,
      default: true
    },
    customBack: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClickLeft() {
      if (this.customBack) {
        this.$emit('routerBack')
      } else {
        this.$router.go(-1)
      }
    },
    onClickRight() {
      this.$emit('clickRight')
    }
  }
}
</script>

<style lang="scss" scoped>
.header-title{
  z-index: 1;
  position: relative;
  .f-right{
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
  }
}
::v-deep .van-nav-bar{
  background: #4381E5;
  .van-icon {
    color: #fff;
  }
  .van-nav-bar__title{
    color: #fff;
  }
  .van-nav-bar__text{
    color: #fff;
  }
}
</style>
