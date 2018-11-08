const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList:[],
    errorMessage:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieList()
  },

  getMovieList: function(){
    util.showBusy('下载热门电影...')
    var that = this
    qcloud.request({
      url: config.service.movieListUrl,
      login: false,
      success: function(result) { 
        wx.hideToast()     
        that.setData({          
          movieList: result.data.data
        })       
      },
      fail: function(error) {
        wx.hideToast()
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  }

})