import { getSignature, uploadImg, uploadImgUrl } from '@/api/upload'
import { mapState, mapActions, mapGetters } from 'vuex'
import { userExamInfo } from '@/api/score-analysis'

export const quesAreaImageMixin = {
  data() {
    return {
      imageUploading: false,
      fileLoading: false
    }
  },
  methods: {
    normalizeAreaList(areaList, imageList, deletable) {
      const areaImages = {}
      for (let i = 0; i < imageList.length; i++) {
        const areaId = imageList[i].areaId
        const imageObj = {
          url: imageList[i].imgPath,
          uuid: imageList[i].uuid,
          deletable: deletable,
          areaId: areaId
        }

        if (!Object.prototype.hasOwnProperty.call(areaImages, areaId)) {
          areaImages[areaId] = []
        }
        areaImages[areaId].push(imageObj)
      }
      // this.areaImgList = areaList
      for (let i = 0; i < areaList.length; i++) {
        const areaId = areaList[i].id
        const generateInfosList = areaList[i].generateInfosList || []
        let quesNoText = ''
        this.areaQuesMap[areaId] = []
        if (generateInfosList.length > 0) {
          for (let j = 0; j < generateInfosList.length; j++) {
            const fullNo = generateInfosList[j].fullNo || ''
            quesNoText += fullNo + '、'
            this.areaQuesMap[areaId].push(generateInfosList[j].id)
          }
          quesNoText = quesNoText.substring(0, quesNoText.length - 1)
        }
        areaList[i].quesNoText = quesNoText
        areaList[i].imageList = []
        if (areaImages[areaId]) {
          areaList[i].imageList = areaImages[areaId]
        }
      }
      this.areaImgList = areaList
    },
    // 返回布尔值
    beforeRead(file, detail) {
      this.areaIndex = detail.name
      this.areaId = this.areaImgList[this.areaIndex].id
      this.cropperShow = true
      this.fileLoading = true
      this.fileToUrl(file, (res) => {
        this.imageUrl = res
        this.fileLoading = false
      })
    },
    afterRead(file) {
      //
    },
    delFromQuesBottom(file) {
      this.delImage(file)
    },
    delFromCard(file) {
      this.delImage(file)
    },
    delImage(file) {
      const uuid = file.uuid
      for (let i = 0; i < this.areaImgList.length; i++) {
        const imageList = this.areaImgList[i].imageList || []
        if (imageList.length > 0) {
          const delIndex = imageList.findIndex(image => {
            return uuid === image.uuid
          })
          if (delIndex > -1) {
            imageList.splice(delIndex, 1)
          }
        }
      }
      this.saveImageToList(this.areaImgList)
    },
    // file转为url
    fileToUrl(file, callback) {
      const reader = new FileReader()
      reader.onload = async() => {
        callback(await reader.result)
      }
      reader.readAsDataURL(file)
    },
    // blob转换为file
    blobToFile(theBlob) {
      theBlob.lastModifiedDate = new Date()
      theBlob.name = 'uuid.jpg'
      return theBlob
    },
    // 隐藏图片裁剪框
    hideCropper() {
      this.fileLoading = false
      this.cropperShow = false
    },
    // 提交裁剪后的图片
    submitImage(data) {
      this.asyncUploadImage(data)
    },
    // 提交图片
    asyncUploadImage(blob) {
      if (this.imageUploading) {
        return
      }
      this.imageUploading = true
      const file = this.blobToFile(blob)
      this.cropperShow = true
      this.apiGetSignature().then(res => {
        const { data, success } = res
        if (success) {
          const formData = new FormData()
          formData.append('access_key_id', data.accessKeyId)
          formData.append('signature', data.signature)
          formData.append('charset', 'UTF-8')
          formData.append('key', data.key)
          formData.append('policy', data.policy)
          formData.append('file', file)

          uploadImg(formData).then(resHttp => {
            if (resHttp.status === 201) {
              const curPath = `${uploadImgUrl.url}/${data.key}`
              this.areaImgList[this.areaIndex].imageList.push({
                url: curPath,
                areaId: this.areaId,
                uuid: data.uuid,
                deletable: true
              })
              if (!this.addImage) {
                this.saveImageToList(this.areaImgList)
              }

              this.cropperShow = false
              this.imageUploading = false
            } else {
              this.$toast(JSON.stringify(resHttp))
              this.cropperShow = false
              this.imageUploading = false
            }
          }).catch(() => {
            this.$notify({
              message: '图片上传出错',
              type: 'danger',
              duration: 2000
            })
            this.imageUploading = false
          })
        } else {
          this.$notify({
            message: '获取签名失败',
            type: 'danger',
            duration: 2000
          })
          this.imageUploading = false
        }
      })
    },
    apiGetSignature() {
      return new Promise((resolve, reject) => {
        getSignature().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 保存图片到缓存
    saveImageToList(areaImgList) {
      let localResult = {}
      if (this.onlineQuesMap[this.paperId]) {
        localResult = this.onlineQuesMap[this.paperId]
        if (localResult.userId !== this.userId) {
          localResult = {}
        }
      }

      const areaMap = {}
      for (const areaImg of areaImgList) {
        const generateInfosList = areaImg.generateInfosList
        const areaId = areaImg.id
        const imageList = areaImg.imageList || []
        for (const ques of generateInfosList) {
          areaMap[ques.quesId] = {
            imageList: imageList,
            areaId: areaId
          }
        }
      }

      // 对quesList的图片重新赋值
      for (const mainQues of this.quesList) {
        if (areaMap[mainQues.quesId]) {
          this.$set(mainQues, 'imageList', areaMap[mainQues.quesId].imageList)
        }
        if (mainQues.childQuesList && mainQues.childQuesList.length > 0) {
          for (const childQues of mainQues.childQuesList) {
            if (areaMap[childQues.quesId]) {
              this.$set(childQues, 'imageList', areaMap[childQues.quesId].imageList)
            }
          }
        }
      }

      const curQuesMap = {
        userId: this.userId,
        quesAnswerMap: localResult.quesAnswerMap,
        areaImgList: areaImgList,
        areaMap: areaMap
      }
      localResult[this.paperId] = curQuesMap
      this.saveOnlineQuesMap(localResult)
    }
  }
}

export const quesResultMixin = {
  computed: {
    ...mapState('exam', {
      onlineQuesMap: state => state.onlineQuesMap
    }),
    ...mapGetters([
      'userId'
    ])
  },
  methods: {
    ...mapActions('exam', ['saveOnlineQuesMap']),
    // 本地已缓存的上传图片
    getLocalImageList() {
      let localResult = {}
      if (this.onlineQuesMap[this.paperId]) {
        localResult = this.onlineQuesMap[this.paperId]
        if (localResult.userId !== this.userId) {
          localResult = {}
        }
      }

      let areaImgList = []
      if (localResult.areaImgList) {
        areaImgList = localResult.areaImgList
      }

      const newImageArr = []
      if (areaImgList.length === 0) {
        return []
      }
      for (const areaObj of areaImgList) {
        const imageArr = areaObj.imageList
        let orderNum = 1
        for (const imageObj of imageArr) {
          newImageArr.push({
            imgPath: imageObj.url,
            orderNum: orderNum,
            areaId: imageObj.areaId,
            uuid: imageObj.uuid
          })
          orderNum++
        }
      }
      return newImageArr
    },
    // 更新quesList选择题答案
    changeChoiceAnswer() {
      let localResult = {}
      if (this.onlineQuesMap[this.paperId]) {
        localResult = this.onlineQuesMap[this.paperId]
        if (localResult.userId !== this.userId) {
          localResult = {}
        }
      }

      const quesAnswerMap = {}
      for (const ques of this.quesList) {
        if (ques.choiceTextArr && ques.choiceTextArr.length > 0) {
          quesAnswerMap[ques.quesId] = ques.answer
        }
        if (ques.childQuesList && ques.childQuesList.length > 0) {
          for (const child of ques.childQuesList) {
            quesAnswerMap[child.quesId] = child.answer
          }
        }
      }

      const curQuesMap = {
        userId: this.userId,
        quesAnswerMap: quesAnswerMap,
        areaImgList: localResult.areaImgList
      }
      localResult[this.paperId] = curQuesMap
      this.saveOnlineQuesMap(localResult)
    }
  }
}

export const examInfoMixin = {
  computed: {
    ...mapGetters([
      'examId'
    ])
  },
  methods: {
    apiGetUserExamInfo(examId) {
      return new Promise((resolve, reject) => {
        userExamInfo(examId).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
