const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
//use moment.js for date format
const moment = require("../../utils/moment-with-locales.min.js")
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
    this.getFavoriteCommentList()
  },

  getFavoriteCommentList: function () {
    qcloud.request({
      url: config.service.favoriteListUrl,     
      success: result => {
        let data = result.data
        console.log(data.data)
        if (!data.code) {
          this.setData({
            commentList: data.data.map(item => {
              item.fromNow = moment(item.create_time).locale('zh_cn').fromNow()
              return item
            })
          })

          console.log(this.data.commentList)
        }
      },
    })
  }

})