import request from '@/utils/request'
import axios from 'axios'

export const uploadImgUrl = {
  url: 'https://ecourse/obs.cn-north-4.myhuaweicloud.com'
}

// 上传附件获得接口签名
export function getSignature() {
  return request({
    url: '/qing/sign',
    method: 'POST'
  })
}

// 上传青云接口
export function uploadImg(formData) {
  return axios({
    method: 'POST',
    url: uploadImgUrl.url,
    data: formData
  })
}
