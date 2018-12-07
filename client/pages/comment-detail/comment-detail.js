const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
const app = getApp()

//const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    preview: false,
    movie: {},
    comment: {} 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let movie = JSON.parse(decodeURIComponent(options.movie))
    let comment = JSON.parse(decodeURIComponent(options.comment))

    let comment_published = app.getPublishedComment(movie)
    if (comment_published) {
      if (comment_published.id == comment.id)
        comment.is_published = true
    }

    comment.is_favorite = app.is_favorite(comment)

    this.setData(
      {
        movie: movie,
        comment: comment,
        preview: options.preview || false,
        comment_published: comment_published
      }      
    )
   
    if(this.data.preview)
      wx.setNavigationBarTitle({
        title: '影评预览'
      })
  },

  //check login before add as favorite
  loginAndAddFavorite: function() {
    let that = this
    app.checkSession({
      success: function () {
        that.addFavorite()
      }
    })   
  },

  //check login before add as favorite
  loginAndDeleteFavorite: function () {
    let that = this
    wx.showModal({
      title: '删除收藏',
      content: '确定要删除收藏吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          app.checkSession({
            success: function () {
              that.deleteFavorite()
            }
          })
        } 
      }
    })    
  },

  //check login before navigate to add comment page
  loginAndAddComment: function () {
    let that = this
    app.checkSession({
      success: function () {
        that.toCommentEditor()
      }
    })
  },

  //navigate to add comment page
  toCommentEditor: function () {
    let that = this
    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success: function (res) {
        let selected = res.tapIndex
        let pageUrl = res.tapIndex == 0 ? '/pages/add-comment/add-comment' : '/pages/add-voice-comment/add-voice-comment'
        wx.navigateTo({
          url: pageUrl + '?id=' + that.data.movie.id + '&title=' + that.data.movie.title + '&image=' + that.data.movie.image,
        })
      }
    })
  },

  //add favorite if not done before 
  addFavorite: function () {    
    // check if it's already added as favorite
    let is_favorite = app.is_favorite(this.data.comment)
    // update is_favorite attribute
    let comment_is_favorite = 'comment.is_favorite'
    this.setData(
        {
          [comment_is_favorite]: is_favorite
        }
    )
    // return if aleady added as favorite
    if (is_favorite) {
      wx.showToast({
        icon: 'none',
        title: '影评已经收藏过'
      })   
    }else {

      wx.showLoading({
        title: '收藏评论'
      })

      let that = this
      qcloud.request({
        url: config.service.addFavoritetUrl,
        login: true,
        method: 'PUT',
        data: {
          comment_id: this.data.comment.id
        },
        success: result => {
          wx.hideLoading()
          let data = result.data
          if (!data.code) {
            wx.showToast({
              title: '收藏评论成功'
            })
            //refresh favorite list and reset storage
            app.insert_user_data(that.data.comment, app.globalData.USER_DATA_TYPES[0])
          } else {
            wx.showToast({
              icon: 'none',
              title: '收藏评论失败'
            })
          }
        },
        fail: () => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '收藏评论失败'
          })
        }
      })
    }    

  },

  //add favorite 
  deleteFavorite: function () {
    wx.showLoading({
      title: '正在删除收藏'
    })

    let that = this
    qcloud.request({
      url: config.service.deleteFavoritetUrl,
      login: true,
      method: 'DELETE',
      data: {
        comment_id: this.data.comment.id
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          wx.showToast({
            title: '删除评论成功'
          })
          //refresh favorite list and reset storage
          app.delete_user_data(that.data.comment, app.globalData.USER_DATA_TYPES[0])
          let comment_is_favorite = 'comment.is_favorite'
          this.setData(
            {
              [comment_is_favorite]: false
            }
          )
        } else {
          wx.showToast({
            icon: 'none',
            title: '删除评论失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '删除评论失败'
        })
      }
    })
  },

  // publish comment
  publishComment: function () {
    let that = this
    let content = this.data.comment.content
    let voiceUploadedUrl = this.data.comment.voiceUploadedUrl
    let voice_duration = this.data.comment.voice_duration
    if (!content && !voiceUploadedUrl) return

    wx.showLoading({
      title: '正在发表评论'
    })

    qcloud.request({
      url: config.service.addCommentUrl,
      login: true,
      method: 'PUT',
      data: {
        content: content,
        voice: voiceUploadedUrl,
        voice_duration: voice_duration,
        movie_id: this.data.movie.id
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {          
          wx.showToast({
            title: '发表评论成功'
          })

          let newComment = data.data
          newComment.fromNow = util.fromNowDate(newComment.create_time)
          newComment.is_published = true
          newComment.url = app.getDetailUrl(newComment)
          //update storage
          app.insert_user_data(newComment, app.globalData.USER_DATA_TYPES[1])

          setTimeout(() => {         
            wx.navigateBack({
              delta: 2, //ignore edit and preview page
              success: function () {
                wx.navigateTo({
                  url: '/pages/comment-list/comment-list?' + 'id=' + that.data.movie.id + '&title=' + that.data.movie.title + '&image=' + that.data.movie.image
                })
              }
            })
          }, 2000)

         
          //get the new comment detail
          //let insertId = data.data.insertId
          //that.getCommentDetail(insertId)

        } else {
          wx.showToast({
            icon: 'none',
            title: '发表评论失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '发表评论失败'
        })
      }
    })
  },

  // upload voice comment to server
  uploadComment() { 
    let that = this
    if (this.data.comment.voiceTempFilePath){
        wx.showLoading({
          title: '上传音频'
        })
        wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: this.data.comment.voiceTempFilePath,
        name: 'file',
        success: res => {
          wx.hideToast()
          let data = JSON.parse(res.data)         
          if (!data.code) {
            let comment_voice_uploaded_url = 'comment.voiceUploadedUrl'
            that.setData({
              [comment_voice_uploaded_url] : data.data.imgUrl //only update voiceUrl of comment
            })     
            that.publishComment()    
          }      
        }
      })
    }else
      this.publishComment() 
  },

  //function to get the comment detail based id
  getCommentDetail: function (id) {  
    var that = this
    qcloud.request({
      url: config.service.commentDetailUrl + id,
      success: function (result) {
        wx.hideToast()
        let data = result.data
        if (!data.code) {
          var newComment = data.data
          newComment.fromNow = util.fromNowDate(newComment.create_time)
          newComment.is_published = true
          newComment.url = app.getDetailUrl(newComment)
          //update storage
          app.insert_user_data(newComment, app.globalData.USER_DATA_TYPES[1])

          wx.navigateBack({
            delta: 2,
            success: function () {
              wx.navigateTo({
                url: '/pages/comment-list/comment-list?' + 'id=' + that.data.movie.id + '&title=' + that.data.movie.title + '&image=' + that.data.movie.image
              })
            }
          })

        }
      },
      fail: function () {       
      }
    })
  },

  editComment: function() {
   wx.navigateBack()
  },
 
  playVoice() {
    console.log('play voice')
    
    innerAudioContext.src = this.data.preview ? this.data.comment.voiceTempFilePath : this.data.comment.voice
    innerAudioContext.play()
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })  
  }

  /*onUnload() {   
   console.log('unload page')
   if(this.data.comment.voice){
      let innerAudioContext = wx.createInnerAudioContext();
      innerAudioContext.stop();   
      console.log('stop play')
    }    
  } */

})