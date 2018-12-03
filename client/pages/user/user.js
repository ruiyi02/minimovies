const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
const app = getApp()

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
    console.log('user page showing')
    let that=this
    app.checkSession({
      success: function () {
        that.setData({
          loggedin: true
        })
        that.getUserDataFromStorage()
       // that.getCommentList()
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

  getUserDataFromStorage() {
    let that = this
    let dataType = app.globalData.USER_DATA_TYPES[this.data.activeTabIndex]
    wx.getStorage({
      key: dataType,
      success: function(res) {
         that.setData({
           commentList: res
         })
      },
    })
  },

  getCommentList: function () {
    if (this.data.activeTabIndex ==0)
      util.showBusy('刷新我的收藏...')     
    else
      util.showBusy('刷新我的评论...') 

    let dataType = app.globalData.USER_DATA_TYPES[this.data.activeTabIndex]

    let that = this
    app.getUserData(dataType, 
      {        
        success: ({ commentList }) => {
          wx.hideToast()
          wx.stopPullDownRefresh()
          this.setData({
            commentList: commentList.map(item => {
              item.fromNow = util.fromNowDate(item.create_time)
              item.is_favorite = that.data.activeTabIndex == 0
              item.url = app.getDetailUrl(item)
              return item
            })
          })
        }
      }
    )  
  }
})