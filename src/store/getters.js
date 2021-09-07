/*
 * @Author: GaoHongtian
 * @Date: 2021-02-19 20:04:34
 * @LastEditTime: 2021-03-09 18:49:18
 * @LastEditors: GaoHongtian
 * @Description: In User Settings Edit
 * @FilePath: /online-exam/src/store/getters.js
 */
const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  nickName: state => state.user.nickName,
  userId: state => state.user.userId,
  schoolName: state => state.user.schoolName,
  activeTabbar: state => state.app.activeTabbar,
  examId: state => state.exam.examId
}
export default getters
