//app.js
const qcloud = require('./vendor/wafer2-client-sdk/index')
const config = require('./config')
const util = require('./utils/util.js')

App({
    globalData: {
      userInfo: null,
      logged: false,
      USER_DATA_TYPES: ['favorite', 'published']   
    },
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },

    checkSession({ success }) {
      if (this.globalData.userInfo) {        
        return success && success({
          userInfo: this.globalData.userInfo
        })
      }
      
      wx.checkSession({
        success: () => {
          //session_key 未过期，并且在本生命周期一直有效
          console.log('session_key still valid, call loginWithCode() to get userInfo')
          util.showBusy('正在登录')
          qcloud.loginWithCode({
            success: res => {
              wx.hideToast();
              this.globalData.userInfo = res
              this.globalData.logged = true
              console.log(this.globalData.userInfo)
              success && success({
                userInfo: this.globalData.userInfo
              })
            },
            fail: err => {
              wx.hideToast();
              console.error(err)
              util.showModel('登录错误', err.message)            
            }
          })
        },
        fail: () => {
          // session_key 已经失效，需要重新执行登录流程
          wx.navigateTo({
            url: "/pages/login/login"
          })
        }
      })
    },

  // get user favorite list or published comment list with call backs
  getUserData: function (dataType, { success, fail }) {
    var that = this
    qcloud.request({
      url: dataType == this.globalData.USER_DATA_TYPES[0] ? config.service.favoriteListUrl : config.service.commentPublishedUrl,
      login: true,
      success: function (result) {
        let data = result.data
        if (!data.code) {
          let commentList = data.data
          success && success({
            commentList
          })        
        }else
          fail && fail({
            error
          })  
      },
      fail: function (error) {
        fail && fail({
          error
        })        
      }
    })
  },

  // get comment detail page url
  getDetailUrl: function (comment) {
    let movie = {
      id: comment.movie_id,
      title: comment.title,
      category: comment.category,
      image: comment.image
    }
    delete comment.url
    return '/pages/comment-detail/comment-detail?movie=' + encodeURIComponent(JSON.stringify(movie)) + '&comment=' + encodeURIComponent(JSON.stringify(comment))
  },

  //check if comment is favorite from storage
  is_favorite(comment) {
    let favoriteList = wx.getStorageSync(this.globalData.USER_DATA_TYPES[0])
    if (favoriteList)
      for (var item of favoriteList){
        if (item.id == comment.id) {      
          return true
        } 
      }    
    return false
  },

  //check if comment is published from storage
  is_published(comment) {
    let publishedList = wx.getStorageSync(this.globalData.USER_DATA_TYPES[1])
    if (publishedList)
      for (var item of publishedList) {
        if (item.id == comment.id) {
          return true
        }
      }  
    return false
  },

  //check if my published comment of a movie from storage
  getPublishedComment(movie) {
    let publishedList = wx.getStorageSync(this.globalData.USER_DATA_TYPES[1])
    if (publishedList)
      for (var item of publishedList) {
        if (item.movie_id == movie.id) {
          return item
        }
      }
    return null
  },

  // delete item from user data list
  delete_user_data(comment, dataType) {
    let list = wx.getStorageSync(dataType)
    if (list){
      //delete item from list
      var removeIndex = list.map(function (item) { return item.id; }).indexOf(comment.id);
      if (removeIndex !== -1) 
        list.splice(removeIndex, 1);

      //update storage
      wx.setStorage({
        key: dataType,
        data: list,
      })
    }
  },

  // insert new item into user data list
  insert_user_data(comment, dataType) {
    let list = wx.getStorageSync(dataType);
    if (list) {
      //insert item into list at top
      list.unshift(comment)
      //update storage
      wx.setStorage({
        key: dataType,
        data: list,
      })
    }
  }

})