//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    userInfo: app.globalData.userInfo,
    logged: app.globalData.logged
  },

  // 用户登录示例
  bindGetUserInfo: function () {
    if (app.globalData.logged) return

    util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (session) {
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qcloud.loginWithCode({
        success: res => {
          app.globalData.userInfo=res
          app.globalData.logged=true
          this.setData({ userInfo: res, logged: true })
          util.showSuccess('登录成功')
          wx.navigateBack({});
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    } else {
      // 首次登录
      qcloud.login({
        success: res => {
          app.globalData.userInfo = res
          app.globalData.logged = true
          this.setData({ userInfo: res, logged: true })
          util.showSuccess('登录成功')
          wx.navigateBack({});
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }
  }

})