const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: '好多热门电影！快去点评吧',
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRandomMovie()
  },

  //function to get a random comment
  getRandomMovie: function () {   
    let that = this
    qcloud.request({
      url: config.service.movieRandomUrl,
      success: function (result) {       
        let data = result.data
        if (!data.code) {
          let item = data.data
          if (item.id) {  //only if it comment
            item.fromNow = util.fromNowDate(item.create_time)
            item.url = that.getDetailUrl(item)
          }
        
          that.setData({
            movie: item
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

    return '/pages/comment-detail/comment-detail?movie=' + encodeURIComponent(JSON.stringify(movie)) + '&comment=' + encodeURIComponent(JSON.stringify(comment))

  }


})