export function normalizeChoicesQues(quesTitle) {
  const quesObj = {
    content: [], // 内容数组
    choiceArr: [] // 选项拆分数组
  }
  if (!quesTitle) {
    return
  }
  let title = quesTitle
  title = title.replace(/<br\s?\/?>/g, '<p></p>') // 将br换行转换为p标签
  const imgReg = /<img.*?(?:>|\/>)|<table[\s\S]+?<\/table>|<strong[\s\S]+?<\/strong>|<em[\s\S]+?<\/em>|<u[\s\S]+?<\/u>|<span[\s\S]+?<\/span>|<s[\s\S]+?<\/s>/gi
  const choiceReg = /<choice[\s\S]+?<\/choice>/gi
  const imgTableSplitReg = /<img.*?(?:>|\/>)|<table[\s\S]+?<\/table>|<strong[\s\S]+?<\/strong>|<em[\s\S]+?<\/em>|<u[\s\S]+?<\/u>|<span[\s\S]+?<\/span>|<s[\s\S]+?<\/s>/
  const replaceChoiceReg = /<choice class=(['"])choice-[a-z](['"])>|<\/choice>/g
  const replacePReg = /<(p|div)>|<\/(p|div)>/g

  const choiceSplitArr = title.match(choiceReg) // 根据choice标签包裹 字符串拆分为选项字符串数组
  const choiceArr = []

  if (choiceSplitArr && choiceSplitArr.length) {
    for (const choiceStr of choiceSplitArr) {
      const arr = choiceStr.replace(replaceChoiceReg, '').split('.') // 单个选项字符串["A", "选项内容"]
      if (arr.length > 1) {
        const choiceCharStr = arr[0] // A B C D E F G
        const choiceCharStrPoint = `${choiceCharStr}.` // A. B. C. D. E. F. G.
        let choiceContent = choiceStr.replace(replaceChoiceReg, '').replace(choiceCharStrPoint, '') // 选项内容只保留内容
        if (choiceContent && choiceContent.indexOf('<p>') !== -1) { // 解决选项换行问题
          choiceContent = choiceContent.replace(/<\/p>/, '')
          choiceContent = choiceContent.replace(/<p>/, '')
        }
        choiceArr.push({
          choice: choiceCharStr.replace(replacePReg, ''),
          cont: choiceContent,
          charNumber: choiceContent.length,
          answer: ''
        })
      }
      title = title.replace(choiceStr, '') // 选择题将选项去除 只保留题干
    }
  }

  title = title.replace(/<p> \s+|(&nbsp;)+ <\/p>/g, '') // 去除p标签之间的空格
  const pReg = /<(p|div)[\s\S]+?<\/(p|div)>|<(table)[\s\S]+?<\/(table)>/gi
  const pArr = title.match(pReg)

  const strArrs = []
  if (pArr && pArr.length > 0) {
    for (let p of pArr) {
      p = p.replace(/[\r\n]/g, '') // 去掉回车
      const strArr = []
      const imgArr = p.match(imgReg)
      if (imgArr && imgArr.length > 0) {
        const splitArr = p.split(imgTableSplitReg)
        splitArr.forEach((str, index) => {
          const obj = {
            type: 'text',
            cont: str.replace(replacePReg, '')
          }
          strArr.push(obj)
          if (imgArr.length > splitArr.indexOf(str) && imgArr[index]) {
            const objImg = {
              type: 'img',
              cont: imgArr[index]
            }
            if (imgArr[index].startsWith('<table')) {
              objImg.type = 'table'
            } else if (imgArr[index].startsWith('<strong')) {
              objImg.type = 'strong'
            } else if (imgArr[index].startsWith('<em')) {
              objImg.type = 'em'
            } else if (imgArr[index].startsWith('<u')) {
              objImg.type = 'u'
            } else if (imgArr[index].startsWith('<span')) {
              objImg.type = 'span'
            } else if (imgArr[index].startsWith('<s')) {
              objImg.type = 's'
            }
            strArr.push(objImg)
          }
        })
      } else {
        const pStr = p.replace(replacePReg, '')
        if (pStr !== '') {
          const obj = { type: 'text', cont: pStr }
          strArr.push(obj)
        }
      }
      if (strArr.length > 0) {
        strArrs.push(strArr)
      }
    }
  }

  quesObj.content = strArrs
  quesObj.choiceArr = choiceArr
  return quesObj
}
