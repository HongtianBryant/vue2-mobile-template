<template>
  <div class="choice-radio">
    <van-radio v-model="checked" icon-size="30">
      <div class="content" v-html="content"></div>
      <template #icon="props">
        <span class="check-icon" :class="{'active': props.checked }">A</span>
      </template>
    </van-radio>
  </div>
</template>

<script>
export default {
  name: 'ChoiceRadio',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checked: false
    }
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.check-icon{
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
</style>
