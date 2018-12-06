const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
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
      url: '/pages/comment-detail/comment-detail?preview=true&' + 'movie=' + encodeURIComponent(JSON.stringify(this.data.movie)) + '&comment=' + encodeURIComponent(JSON.stringify(comment)),
    })
  }
 
  
})