<!--
 * @Author: GaoHongtian
 * @Date: 2021-03-04 14:38:27
 * @LastEditTime: 2021-03-10 15:36:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /online-exam/src/views/exam-analysis/index.vue
-->
<template>
  <div class="page-container">
    <page-header :left-arrow="true" :title="pageTitle" :custom-back="true" @routerBack="goBack"></page-header>
    <div class="tab">
      <router-link class="tab-item" to="/exam-analysis/my-score">
        <span class="tab-link">我的成绩</span>
      </router-link>
      <router-link class="tab-item" to="/exam-analysis/ques-analysis">
        <span class="tab-link">试题分析</span>
      </router-link>
      <router-link class="tab-item" to="/exam-analysis/knowledge-analysis">
        <span class="tab-link">知识点分析</span>
      </router-link>
      <router-link class="tab-item" to="/exam-analysis/improvement-plan">
        <span class="tab-link">提升计划</span>
      </router-link>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'

export default {
  name: 'ExamAnalysis',
  components: {
    PageHeader
  },
  data() {
    return {
      pageTitle: '我的成绩'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.path.indexOf('/my-score') > -1) {
          this.pageTitle = '我的成绩'
        } else if (route.path.indexOf('/ques-analysis') > -1) {
          this.pageTitle = '试题分析'
        } else if (route.path.indexOf('/knowledge-analysis') > -1) {
          this.pageTitle = '知识点分析'
        } else if (route.path.indexOf('/improvement-plan') > -1) {
          this.pageTitle = '能力提升'
        }
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    goBack() {
      this.$router.push({
        path: '/home'
      })
    },
    setTitle(title) {
      console.log(title)
      this.pageTitle = title
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-wrapper{
  height: calc(100vh - 80px);
  overflow: hidden;
}
.tab{
  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background-color: #fff;
  border-bottom: 1px solid #d4dae6;
  .tab-item{
    flex: 1;
    text-align: center;
    position: relative;
    &:after {
      content: '';
      width: 200%;
      position: absolute;
      top: 6px;
      left: 0;
      transform: scale(.5);
      transform-origin: 0 0;
      border-right: 2px solid rgba(90, 107, 130, 0.2);
      height: 50px;
      box-sizing: border-box;
    }
    &:last-child{
      &:after {
        border-right: 0;
      }
    }
    .tab-link{
      padding-bottom: 5px;
      color: #8d99a6;
      font-size: 14px;
    }
    &.router-link-active{
      background-color: #e2f8fe;
      .tab-link{
        color: #6dd5fa;
      }
    }
  }
}
</style>
