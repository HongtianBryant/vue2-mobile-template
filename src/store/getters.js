/*
 * @Author: GaoHongtian
 * @Date: 2021-02-19 20:04:34
 * @LastEditTime: 2021-09-07 21:31:29
 * @LastEditors: Edy
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
  activeTabbar: state => state.app.activeTabbar
}
export default getters
