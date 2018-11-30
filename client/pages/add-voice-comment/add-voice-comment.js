const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
const app = getApp()

// 处理录音逻辑
const recorderManager = wx.getRecorderManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    voiceTempFilePath: '',
    voiceDuration: 0
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

    let that = this
    recorderManager.onStop(function (res) {
      // 不允许小于 1 秒
      if (res.duration < 1000) {
        //util.showTips('录音过短');
        return;
      }
      that.setData({
        voiceTempFilePath: res.tempFilePath,
     // voiceDuration: (res.duration / 1000).toFixed(2)
      })
      console.log(res.tempFilePath)     
    });
  },

  onShow: function () {

  },

  voiceStartRecord() {
    console.log('start record');
    recorderManager.start({
      // 最大长度设置为 1 分钟
      duration: 2 * 60 * 1000,
      // 格式
      format: 'mp3',
      sampleRate: 16000,
      encodeBitRate: 25600,
      frameSize: 9,
      numberOfChannels: 1
    });
  },

  voiceEndRecord() {
    console.log('stop record');
    recorderManager.stop();
  },

  previewComment: function () {
    let comment = {
      voiceTempFilePath: this.data.voiceTempFilePath,
     // voiceDuration: this.data.voiceDuration,
      username: app.globalData.userInfo.nickName,
      avatar: app.globalData.userInfo.avatarUrl
    }

    wx.navigateTo({
      url: '/pages/comment-detail/comment-detail?preview=true&voice=true&' + 'movie=' + JSON.stringify(this.data.movie) + '&comment=' + JSON.stringify(comment),
    })
  }


})