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
    inputOptions: ['文字','音频'],
    selectedInputIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    this.getMovie(options.id)
  },

  //function to get the movie detail based id
  getMovie: function(id) {
    util.showBusy('电影内容加载中...') 
    var that = this
    qcloud.request({
      url: config.service.movieDetailUrl + id,
      success: function(result) {
        wx.hideToast()
        let data = result.data
        if (!data.code) {
          that.setData({
            movie: data.data
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: function() {
        wx.hideToast()
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    })
  },

 //navigate to comment list page
  viewComments: function(){
    wx.navigateTo({
      url: '/pages/comment-list/comment-list?' + 'id=' + this.data.movie.id + '&title=' + this.data.movie.title + '&image=' + this.data.movie.image
    })
  },

  //check login before navigate to add comment page
  loginAndAddComment: function () {
    let that = this
    app.checkSession({
      success: function () {
        that.toCommentEditor()
      }
    })
  },

  //navigate to add comment page
  toCommentEditor: function () {
    let pageUrl ='/pages/add-comment/add-comment'
    if(this.data.selectedInputIndex==1)
      pageUrl = '/pages/add-voice-comment/add-voice-comment'
    wx.navigateTo({
      url: pageUrl+'?id=' + this.data.movie.id + '&title=' + this.data.movie.title + '&image=' + this.data.movie.image,
    })
  },

  selectInputType: function (e) {
    this.setData({
      selectedInputIndex: e.detail.value
    })

    this.loginAndAddComment()
  },

})