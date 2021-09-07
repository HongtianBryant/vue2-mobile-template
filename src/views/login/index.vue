<template>
  <div class="page-container">
    <div class="login-wrap">
      <div class="bg-img" :style="bgImg"></div>
      <div class="login-title">登录</div>
      <van-form v-model="loginForm" @submit="onSubmit">
        <div class="form-item">
          <van-field
            v-model="loginForm.userName"
            name="用户名"
            :left-icon="iconUserName"
            placeholder="用户名"
            :error-message="errMsg.userName"
            :rules="userNameRules"
          ></van-field>
        </div>
        <div class="form-item">
          <van-field
            v-model="loginForm.password"
            type="password"
            name="密码"
            :left-icon="iconPassword"
            placeholder="密码"
            :error-message="errMsg.password"
            :rules="passwordRules"
          ></van-field>
        </div>
        <div style="margin: 16px 40px;">
          <van-button :loading="loading" block type="info" native-type="submit">登录</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import iconUserName from '@/assets/login/icon-username.png'
import iconPassword from '@/assets/login/icon-password.png'
import loginImg from '@/assets/login/login_bg.jpg'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value) => {
      if (!value) {
        this.errMsg.userName = '请正确输入用户名'
        return false
      } else {
        return true
      }
    }
    const validatePassword = (rule, value) => {
      if (value.length < 6) {
        this.errMsg.userName = '密码不能少于6位'
        return false
      } else {
        return true
      }
    }
    return {
      bgImg: {
        backgroundImage: `url(${loginImg})`
      },
      iconUserName,
      iconPassword,
      loginForm: {
        userName: '',
        password: ''
      },
      errMsg: {
        userName: '',
        password: ''
      },
      userNameRules: [
        { required: true, trigger: 'blur', validator: validateUsername }
      ],
      passwordRules: [
        { required: true, trigger: 'blur', validator: validatePassword }
      ],
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    onSubmit() {
      this.loading = true
      this.$store.dispatch('user/login', this.loginForm)
        .then(() => {
          this.$router.push({ path: this.redirect || '/' })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrap{
  padding-top: 100px;
  box-sizing: border-box;
  .bg-img{
    position:fixed;
    top: 0;
    left: 0;
    width:100%;
    height:100%;
    min-width: 100vw;
    z-index: -10;
    zoom: 1;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .login-title{
    font-family: PingFangSC-Semibold;
    font-size: 28px;
    color: #FFFFFF;
    text-align: center;
    text-shadow: 1px 2px 0 rgba(6,68,167,0.59);
    padding-bottom: 20px;
    box-sizing: border-box;
  }
  .form-item{
    padding: 0 40px;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  ::v-deep .van-cell {
    border-radius: 5px;
}
}
</style>
