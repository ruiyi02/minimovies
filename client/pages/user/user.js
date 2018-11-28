const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
const app = getApp()

const COMMENT_LIST_TYPES = ['favorite', 'published']

let sliderWidth = 26 // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loggedin: false,
    tabs: ["收藏", "发布"],
    activeTabIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //caculate navbar slider position
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeTabIndex
        });
      }
    })
  },

  onShow: function(){
    let that=this
    app.checkSession({
      success: function () {
        that.setData({
          loggedin: true
        })
        that.getCommentList()
      }
    })   
  },

  //swhich news type when tap the top navbar
  onTabTap: function (e) {
    if (this.data.activeTabIndex != e.currentTarget.id) {
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeTabIndex: e.currentTarget.id
      });

      this.getCommentList()
    }
  },

  onPullDownRefresh: function () {
    if (this.data.loggedin)
      this.getCommentList()
  },

  getCommentList: function () {
    if (this.data.activeTabIndex ==0)
      util.showBusy('刷新我的收藏...')     
    else
      util.showBusy('刷新我的评论...') 
        
    var that = this
    qcloud.request({
      url: this.data.activeTabIndex == 0 ? config.service.favoriteListUrl : config.service.commentPublishedUrl,
      login: true,
      success: function (result) {
        wx.hideToast()
        let data = result.data
        console.log(data.data)
        if (!data.code) {
          that.setData({
            commentList: data.data.map(item => {
              item.fromNow = util.fromNowDate(item.create_time)
              item.is_favorite = that.data.activeTabIndex == 0
              item.url = that.getDetailUrl(item)              
              return item
            })
          })
          console.log(that.data.commentList)
        }
      },

      fail: function (error) {
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