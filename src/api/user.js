import request from '@/utils/request'
import qs from 'qs'

const userLoginUrl = process.env.VUE_APP_LOGIN_API

export function login(data) {
  data = qs.stringify(data)
  return request({
    baseURL: userLoginUrl,
    url: '/api/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    baseURL: userLoginUrl,
    url: '/api/userInfo',
    method: 'get'
  })
}
