const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    preview: false,
    movie: {},
    comment: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(
      {
        movie: JSON.parse(options.movie),
        comment: JSON.parse(options.comment),
        preview: options.preview || false
      }
    )

    if(this.data.preview)
      wx.setNavigationBarTitle({
        title: '影评预览'
      })
  },

  //check login before add as favorite
  loginAndAddFavorite: function() {
    let that = this
    app.checkSession({
      success: function () {
        that.addFavorite()
      }
    })   
  },

  //check login before add as favorite
  loginAndDeleteFavorite: function () {
    let that = this
    app.checkSession({
      success: function () {
        that.deleteFavorite()
      }
    })
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

  //add favorite 
  addFavorite: function () {      
    wx.showLoading({
      title: '正在收藏评论'
    })

    qcloud.request({
      url: config.service.addFavoritetUrl,
      login: true,
      method: 'PUT',
      data: {
        comment_id: this.data.comment.id
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          wx.showToast({
            title: '收藏评论成功'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '收藏评论失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '收藏评论失败'
        })
      }
    })
  },

  //add favorite 
  deleteFavorite: function () {
    wx.showLoading({
      title: '正在删除收藏'
    })

    qcloud.request({
      url: config.service.deleteFavoritetUrl,
      login: true,
      method: 'DELETE',
      data: {
        comment_id: this.data.comment.id
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          wx.showToast({
            title: '删除评论成功'
          })
          wx.navigateBack({})
        } else {
          wx.showToast({
            icon: 'none',
            title: '删除评论失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '删除评论失败'
        })
      }
    })
  },

  publishComment: function (event) {
    let that = this
    let content = this.data.comment.content
    if (!content) return

    wx.showLoading({
      title: '正在发表评论'
    })

    qcloud.request({
      url: config.service.addCommentUrl,
      login: true,
      method: 'PUT',
      data: {
        content,
        movie_id: this.data.movie.id
      },
      success: result => {
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          wx.showToast({
            title: '发表评论成功'
          })

          setTimeout(() => {
            // navigate back to movie detail page then to comment list page
            wx.navigateBack({
              delta: 2,
              success: function() {
                wx.navigateTo({
                  url: '/pages/comment-list/comment-list?' + 'id=' + that.data.movie.id + '&title=' + that.data.movie.title + '&image=' + that.data.movie.image
                })
              }
            })
          }, 2000)
        } else {
          wx.showToast({
            icon: 'none',
            title: '发表评论失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '发表评论失败'
        })
      }
    })
  },

  editComment: function() {
   wx.navigateBack()
  },
  
  //navigate to add comment page
  addComment: function () {
    wx.navigateTo({
      url: '/pages/add-comment/add-comment?' + 'id=' + this.data.movie.id + '&title=' + this.data.movie.title + '&image=' + this.data.movie.image,
    })
  }

 
})