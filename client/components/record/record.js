// 自定义音频播放器
const innerAudio = wx.createInnerAudioContext();
import { formatSeconds } from "./../../utils/util.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    url: {            // 音频地址
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: ''     // 属性初始值（可选），如果未指定则会根据类型选择一个
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isPaused: true, //是否暂停,true 暂停
    lastTime: "",//剩余时间
    currentTime: 0,//播放时间
    clearWaveInterval: null,//其他音频播放的时候暂停动画
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    detached: function () { 
      console.log('control detached') 
      console.log('stop play') 
      innerAudio.stop()
    },
  },


  pageLifetimes: {
    // 组件所在页面的生命周期函数
    hide: function () { 
      console.log('page hide')
      console.log('stop play')
      innerAudio.stop()
    },

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //暂停
    pauseMuisc() {
      innerAudio.pause();
      this.setData({
        currentTime: innerAudio.currentTime
      })
      this.setData({
        isPaused: true
      })
      innerAudio.offEnded()
      innerAudio.offStop()
      innerAudio.offTimeUpdate();
    },
    
    playRecord() {
      innerAudio.src = this.properties.url; // 设置音乐的路径
      if (this.data.isPaused) {
        innerAudio.play();
        innerAudio.startTime = this.data.currentTime;
        this.setData({
          isPaused: false
        })

        innerAudio.onEnded(() => {
          innerAudio.offTimeUpdate();
          this.setData({
            isPaused: true,
            currentTime: 0
          })
        })

        innerAudio.onPlay(() => {
          innerAudio.onTimeUpdate(() => {
            setLastTime();
            this.data.clearWaveInterval = setTimeout(() => {
              stopWave();
            }, 500)
          })
        })

      } else {
        this.pauseMuisc();
      }

      const setLastTime = () => {
        let ct = innerAudio.currentTime;
        let all = innerAudio.duration;
        let last = all - ct;
        this.setData({
          lastTime: formatSeconds(last)
        })
        clearTimeout(this.data.clearWaveInterval);
      }

      const stopWave = () => {
        console.log("stop")
        this.setData({
          isPaused: true
        })
      }
    }
  }
})