const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    commentList:[]
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

    this.getCommentList(movie.id)
  },

  getCommentList: function(movieId) {
    qcloud.request({
      url: config.service.commentListUrl,
      data: {
        movie_id: movieId
      },
      success: result => {
        let data = result.data   
        if (!data.code) {
          this.setData({
            commentList: data.data.map(item => {
              item.createTime = util.formatTime(new Date(item.create_time))
              return item
            })
          })
          console.log(this.data.commentList)
        }
      },
    })
  },

})