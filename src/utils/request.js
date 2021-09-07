import axios from 'axios'
import { Notify } from 'vant'
import store from '@/store'
import { getToken } from '@/utils/auth'

const codeMessage = {
  400: '请求错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求地址出错',
  405: '网络请求格式错误',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 发送跨域cookie是开启
  timeout: 10000 // 超时时间
})

// request 拦截器
service.interceptors.request.use(
  config => {
    // request方发送之前的配置
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // request返回error处理
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const { response } = error
    if (response && response.status) {
      Notify({
        message: codeMessage[response.status] || response.statusText,
        type: 'danger',
        duration: 5 * 1000
      })
      if (response.status === 401) {
        // token失效 刷新token
      }
    }

    return Promise.reject(error)
  }
)

export default service
