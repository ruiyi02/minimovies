const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
        comment: JSON.parse(options.comment)
      }
    )
  },

  //add favorite 
  addFavorite: function (event) {      
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

  //navigate to add comment page
  addComment: function () {
    wx.navigateTo({
      url: '/pages/add-comment/add-comment?' + 'id=' + this.data.movie.id + '&title=' + this.data.movie.title + '&image=' + this.data.movie.image,
    })
  }
 
})