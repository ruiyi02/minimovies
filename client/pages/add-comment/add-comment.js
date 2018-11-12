const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
//use moment.js for date format
const moment = require("../../utils/moment-with-locales.min.js")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    commentValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let movie = {
      id: options.id,
      title: options.title,     
      image: options.image
    }
    this.setData({
      movie: movie
    })
  },

  onShow: function () {
    let that = this
    if (!app.globalData.userInfo) {
      wx.checkSession({
        success: function () {
          //session_key 未过期，并且在本生命周期一直有效
          console.log('session_key 未过期, qcloud.loginWithCode()')
          qcloud.loginWithCode({
            success: res => {
              app.globalData.userInfo = res
              app.globalData.logged = true     
              console.log(app.globalData.userInfo)      
            },
            fail: err => {
              console.error(err)
              util.showModel('登录错误', err.message)
            }
          })
        },
        fail: function () {
          // session_key 已经失效，需要重新执行登录流程
          wx.navigateTo({
            url: "/pages/user/user"
          })
        }
      })
    }


  },

  onInput: function(event) {
    this.setData({
      commentValue: event.detail.value.trim()
    })
  },

  previewComment: function() {
    let comment = {
      content: this.data.commentValue,
      username: app.globalData.userInfo.nickName,
      avatar: app.globalData.userInfo.avatarUrl     
    }

    wx.navigateTo({
      url: '/pages/comment-detail/comment-detail?preview=true&' + 'movie=' + JSON.stringify(this.data.movie) + '&comment=' + JSON.stringify(comment),
    })
  }
 
  
})