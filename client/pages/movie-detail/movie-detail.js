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
    comment_published: {} 
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
          let movie = data.data
          that.setData({
            movie: movie,
            comment_published: app.getPublishedComment(movie) //get my published comment of this movie from storage
          })
          console.log(that.data.comment_published)
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
        //double check again if there is my comment on this movie
        //get my published comment of this movie from storage
        that.setData({
          comment_published: app.getPublishedComment(that.data.movie)
        })
        if (that.data.comment_published) {
          wx.navigateTo({
            url: that.data.comment_published.url
          })
        }else
          that.toCommentEditor()
      }
    })
  },

  //check login before navigate to comment detail page
  loginAndViewComment: function () {
    let that = this
    app.checkSession({
      success: function () {
       wx.navigateTo({
         url: that.data.comment_published.url
       })
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
    
  }

})