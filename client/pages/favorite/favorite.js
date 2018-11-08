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
    util.showBusy('刷新我的收藏...')
    var that = this
    qcloud.request({
      url: config.service.favoriteListUrl,  
      login: true,   
      success: function(result) {
        wx.hideToast()
        let data = result.data
        console.log(data.data)
        if (!data.code) {
          that.setData({
            commentList: data.data.map(item => {
              item.fromNow = moment(item.create_time).locale('zh_cn').fromNow()
              item.url = that.getDetailUrl(item)
              return item
            })
          })
          console.log(that.data.commentList)
        }
      },

      fail: function(error) {
        wx.hideToast()
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
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