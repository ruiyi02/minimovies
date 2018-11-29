//app.js
const qcloud = require('./vendor/wafer2-client-sdk/index')
const config = require('./config')
const util = require('./utils/util.js')

App({
    globalData: {
      userInfo: null,
      logged: false   
    },
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },

    checkSession({ success }) {
      if (this.globalData.userInfo) {        
        return success && success({
          userInfo: this.globalData.userInfo
        })
      }
      
      wx.checkSession({
        success: () => {
          //session_key 未过期，并且在本生命周期一直有效
          console.log('session_key still valid, call loginWithCode() to get userInfo')
          util.showBusy('正在登录')
          qcloud.loginWithCode({
            success: res => {
              wx.hideToast();
              this.globalData.userInfo = res
              this.globalData.logged = true
              console.log(this.globalData.userInfo)
              success && success({
                userInfo: this.globalData.userInfo
              })
            },
            fail: err => {
              wx.hideToast();
              console.error(err)
              util.showModel('登录错误', err.message)            
            }
          })
        },
        fail: () => {
          // session_key 已经失效，需要重新执行登录流程
          wx.navigateTo({
            url: "/pages/login/login"
          })
        }
      })
    }

})