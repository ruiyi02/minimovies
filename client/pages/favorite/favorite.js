const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
//use moment.js for date format
const moment = require("../../utils/moment-with-locales.min.js")
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

  onShow: function(){
    let that=this
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        that.getFavoriteCommentList()
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        wx.navigateTo({
          url: "/pages/user/user"
        })
      }
    })
   
  },

  getFavoriteCommentList: function () {
    qcloud.request({
      url: config.service.favoriteListUrl,  
      login: true,   
      success: result => {
        let data = result.data
        console.log(data.data)
        if (!data.code) {
          this.setData({
            commentList: data.data.map(item => {
              item.fromNow = moment(item.create_time).locale('zh_cn').fromNow()
              item.url = this.getDetailUrl(item)
              return item
            })
          })
          console.log(this.data.commentList)
        }
      },
    })
  },

  getDetailUrl: function (comment) {
    let movie ={
      id: comment.movie_id,
      title: comment.title,
      category: comment.category,
      image: comment.image
    }
    
    return '/pages/comment-detail/comment-detail?' + 'movie=' + JSON.stringify(movie) + '&comment=' + JSON.stringify(comment)
  }

})