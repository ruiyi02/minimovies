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
    comment_published: false,
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
      movie: movie,
      comment_published: app.getPublishedComment(movie)
    })

    this.getCommentList(movie.id)
  },

  onPullDownRefresh: function () {
    this.getCommentList(this.data.movie.id)
  },

  getCommentList: function(movieId) {
    util.showBusy('下载影评列表...') 
    qcloud.request({
      url: config.service.commentListUrl,
      data: {
        movie_id: movieId
      },
      success: result => {
        wx.hideToast()
        wx.stopPullDownRefresh()
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
    delete comment.url
    return '/pages/comment-detail/comment-detail?movie=' + encodeURIComponent(JSON.stringify(this.data.movie)) + '&comment=' + encodeURIComponent(JSON.stringify(comment))
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
    let that = this
    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success: function (res) {
        let selected = res.tapIndex
        let pageUrl = res.tapIndex == 0 ? '/pages/add-comment/add-comment' : '/pages/add-voice-comment/add-voice-comment'
        wx.navigateTo({
          url: pageUrl + '?id=' + that.data.movie.id + '&title=' + that.data.movie.title + '&image=' + that.data.movie.image,
        })
      }
    })
  },
  
})