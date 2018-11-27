const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function () {
    let that = this
    app.checkSession({
      success: function () {
        that.getPublishedCommentList()
      }
    })

  },

  getPublishedCommentList: function () {
    util.showBusy('刷新我的评论...')
    var that = this
    qcloud.request({
      url: config.service.commentPublishedUrl,
      login: true,
      success: function (result) {
        wx.hideToast()
        let data = result.data
        console.log(data.data)
        if (!data.code) {
          that.setData({
            commentList: data.data.map(item => {
              item.fromNow = util.fromNowDate(item.create_time)
              item.post_by_me = true         
              item.url = that.getDetailUrl(item)              
              return item
            })
          })
          console.log(that.data.commentList)
        }
      },

      fail: function (error) {
        wx.hideToast()
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },

  getDetailUrl: function (comment) {
    let movie = {
      id: comment.movie_id,
      title: comment.title,
      category: comment.category,
      image: comment.image    
    }

    return '/pages/comment-detail/comment-detail?' + 'movie=' + JSON.stringify(movie) + '&comment=' + JSON.stringify(comment)
  }

})