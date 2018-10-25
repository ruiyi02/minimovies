const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const _ = require('../../utils/util')

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

  onInput: function(event) {
    this.setData({
      commentValue: event.detail.value.trim()
    })
  },

  addComment: function(event) {
    let content = this.data.commentValue
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
            wx.navigateBack()
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
})