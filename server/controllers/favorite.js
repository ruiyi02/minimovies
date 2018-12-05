const DB = require('../utils/db')

module.exports = {

  /**
   * 添加收藏评论
   */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId   
    let commentId = +ctx.request.body.comment_id

    if (!isNaN(commentId)) {
      await DB.query('INSERT INTO favorite_comments(user, comment_id) VALUES (?, ?)', [user, commentId])
    }

    ctx.state.data = {}
  },

  /**
   * 删除收藏评论
   */
  delete: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let commentId = +ctx.request.body.comment_id

    if (!isNaN(commentId)) {
      await DB.query('delete from favorite_comments where user=? and comment_id=?', [user, commentId])
    }

    ctx.state.data = {}
  },

  /**
   * 获取收藏的评论列表
   */
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    ctx.state.data = await DB.query('select comments.*, movies.title, movies.image, movies.category from favorite_comments join comments on favorite_comments.comment_id=comments.id join movies on comments.movie_id=movies.id where favorite_comments.user = ? order by favorite_comments.create_time DESC', [user])
  }

}