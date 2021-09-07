<template>
  <div class="app-wrapper">
    <section class="app-main">
      <router-view :key="key"></router-view>
    </section>
    <van-tabbar v-model="active" @change="changeTab">
      <!-- <van-icon name="wap-home-o" /> -->
      <van-tabbar-item name="home" to="/home" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item name="mine" to="/mine/index" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Layout',
  data() {
    return {
      active: ''
    }
  },
  computed: {
    key() {
      return this.$route.path
    },
    ...mapState('app', {
      activeTabbar: state => state.activeTabbar
    })
  },
  watch: {
    '$route.path': function() {
      this.active = this.activeTabbar
    }
  },
  created() {
    this.active = this.activeTabbar
  },
  methods: {
    ...mapActions('app', ['changeTabbar']),
    changeTab(active) {
      this.changeTabbar(active)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main{
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
  // padding: 50px;
}
</style>
