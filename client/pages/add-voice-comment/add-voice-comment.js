const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
const app = getApp()

// 处理录音逻辑
const recorderManager = wx.getRecorderManager();
var recordTimeInterval

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    voiceTempFilePath: '',
    voice_duration: 0,
    recording: false,
    recordTime: 0,
    formatedRecordTime: '00:00:00',
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

    recorderManager.onStart(() => {
      console.log('recorder start')
      var that = this
      this.setData({
        recording: true
      })
      recordTimeInterval = setInterval(function () {
        var recordTime = that.data.recordTime += 1
        that.setData({
          formatedRecordTime: util.formatNumberTime(that.data.recordTime),
          recordTime: recordTime
        })
      }, 1000)
    })

    recorderManager.onStop(function (res) {
      // 不允许小于 1 秒
      if (res.duration < 1000) {
        wx.showToast({
          title: "录音时间太短",
          icon: "none",
          duration: 1000
        });
        return;
      }
      that.setData({
        voiceTempFilePath: res.tempFilePath,
        voice_duration: Math.ceil(res.duration / 1000)
      })
      console.log(res.tempFilePath)     

      that.setData({
        recording: false
      })
      clearInterval(recordTimeInterval)
    });
  },

  onShow: function () {
     this.setData({
       recordTime: 0,
       formatedRecordTime: '00:00:00'
     })
  },

  voiceStartRecord() {
    console.log('start record');
    recorderManager.start({
      // 最大长度设置为 1 分钟
      duration:  10 * 1000,
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
    var comment = {
      voiceTempFilePath: this.data.voiceTempFilePath,
      voice_duration: this.data.voice_duration,
      username: app.globalData.userInfo.nickName,
      avatar: app.globalData.userInfo.avatarUrl
    }

    console.log(comment)

    wx.navigateTo({
      url: '/pages/comment-detail/comment-detail?preview=true&voice=true&' + 'movie=' + JSON.stringify(this.data.movie) + '&comment=' + JSON.stringify(comment),
    })
  }


})