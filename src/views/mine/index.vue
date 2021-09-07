<template>
  <div class="page-container">
    <page-header :left-arrow="false" title="我的"></page-header>
    <div class="header-wrap">
      <div class="avatar">
        <van-image :src="avatar">
          <template v-slot:error>
            <div class="avatar-default"></div>
          </template>
        </van-image>
      </div>
      <div class="user-info">
        <div class="nick-name">
          {{ nickName }}
        </div>
        <div class="scho-name">
          {{ schoolName }}
        </div>
      </div>
    </div>
    <div class="login-out">
      <van-button type="primary" color="#4381E5" plain block @click="logout">退出</van-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageHeader from '@/components/PageHeader'

export default {
  name: 'Mine',
  components: {
    PageHeader
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name',
      'nickName',
      'schoolName'
    ])
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>
<style lang='scss' scoped>
.page-container{
  position: relative;
  height: calc(100vh - 50px);
  .header-wrap{
    background: #ccc;
    height: 150px;
    display: flex;
    align-items: center;
    .avatar{
      width: 60px;
      height: 60px;
      margin-left: 15px;
      border-radius: 50%;
      background: #ddd;
      .avatar-default{
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #ddd;
      }
    }
    .user-info{
      flex: 1;
      height: 56px;
      padding-left: 15px;
      .nick-name{
        color: #4e565f;
        font-size: 18px;
      }
      .scho-name{
        color: #4e565f;
        font-size: 14px;
        margin-top: 18px;
      }
    }
  }
  .login-out{
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
  }
}
</style>
