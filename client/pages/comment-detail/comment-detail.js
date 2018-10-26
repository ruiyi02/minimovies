// pages/comment-detail/comment-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    comment: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(
      {
        movie: JSON.parse(options.movie),
        comment: JSON.parse(options.comment)
      }
    )

    console.log(this.data.movie);
    console.log(this.data.comment);
  }
 
})