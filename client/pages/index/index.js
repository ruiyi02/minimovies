const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRandomComment()
  },

  //function to get a random comment
  getRandomComment: function () {   
    let that = this
    qcloud.request({
      url: config.service.commentRandomUrl,
      success: function (result) {       
        let data = result.data
        console.log(data.data)
        if (!data.code) {
          let item = data.data
          item.fromNow = util.fromNowDate(item.create_time)
          that.setData({
            comment: item
          })
        }
      },
      fail: function () {     
      }
    })
  },

})