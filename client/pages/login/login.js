//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {  
  },

  //监听返回键和navigateBack事件
  onUnload: function () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];   
    if (prevPage.route == "pages/user/user"){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }   
  },

  // 用户登录示例
  bindGetUserInfo: function () {     
    const session = qcloud.Session.get()
    if (session) {
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      console.log('qcloud.loginWithCode!')
      util.showBusy('正在登录')
      qcloud.loginWithCode({       
        success: res => {
          app.globalData.userInfo=res
          app.globalData.logged=true   
          util.showSuccess('登录成功')
          wx.navigateBack({});
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    } else {
      //首次登录
      //检查是否授权后，再登录云端    
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo'] === true) {
            console.log('qcloud.login!')
            util.showBusy('正在登录')
            qcloud.login({
              success: res => {
                app.globalData.userInfo = res
                app.globalData.logged = true
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
    }
  }
})