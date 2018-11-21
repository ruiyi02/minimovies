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
              item.fromNow = util.fromNowDate(item.create_time)
              item.url = this.getDetailUrl(item)
              return item
            })
          })
          console.log(this.data.commentList)
        }
      },
    })
  },

  getDetailUrl: function(comment){
    return '/pages/comment-detail/comment-detail?' + 'movie=' + JSON.stringify(this.data.movie) + '&comment=' + JSON.stringify(comment)
  },

  //check login before navigate to add comment page
  loginAndAddComment: function () {
    let that = this
    app.checkSession({
      success: function () {
        that.addComment()
      }
    })
  },

  //navigate to add comment page
  addComment: function () {
    wx.navigateTo({
      url: '/pages/add-comment/add-comment?' + 'id=' + this.data.movie.id + '&title=' + this.data.movie.title + '&image=' + this.data.movie.image,
    })
  }
  
})