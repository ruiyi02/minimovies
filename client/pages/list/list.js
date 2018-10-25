var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

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
      success(result) {   
        let list = result.data.data
        //format date using moment lib
        list.forEach(function (item) {
          item.create_time = util.formatDate(new Date(item.create_time))
        });   
        that.setData({          
          movieList: list
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  }

})