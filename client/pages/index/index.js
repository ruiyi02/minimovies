const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRandomComment()
  },

  //function to get a random comment
  getRandomComment: function () {   
    let that = this
    qcloud.request({
      url: config.service.commentRandomUrl,
      success: function (result) {       
        let data = result.data
        if (!data.code) {
          let item = data.data
          item.fromNow = util.fromNowDate(item.create_time)
          item.url = that.getDetailUrl(item)
          that.setData({
            comment: item
          })
        }
      },
      fail: function () {     
      }
    })
  },

  getDetailUrl: function (comment) {
    let movie = {
      id: comment.movie_id,
      title: comment.title,
      image: comment.image
    }
  
    return '/pages/comment-detail/comment-detail?movie=' + JSON.stringify(movie) + '&comment=' + JSON.stringify(comment)

  }


})