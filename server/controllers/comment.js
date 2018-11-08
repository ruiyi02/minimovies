const DB = require('../utils/db')

module.exports = {

  /**
   * 添加评论
   */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let movieId = +ctx.request.body.movie_id
    let content = ctx.request.body.content || null

    if (!isNaN(movieId)) {
      await DB.query('INSERT INTO comments(user, username, avatar, content, movie_id) VALUES (?, ?, ?, ?, ?)', [user, username, avatar, content, movieId])
    }

    ctx.state.data = {}
  },

  /**
   * 获取评论列表
   */
  list: async ctx => {
    let movieId = +ctx.request.query.movie_id

    if (!isNaN(movieId)) {
      if (ctx.state.$wxInfo){
        //check if it's user's favorite comment if logged in
        let user = ctx.state.$wxInfo.userinfo.openId
        ctx.state.data = await DB.query('select comments.*, IFNULL(favorite_comments.comment_id, 0) as favorite_comment_id from comments left join favorite_comments on favorite_comments.comment_id=comments.id and favorite_comments.user=? where comments.movie_id = ?', [user, movieId])
      }else
        ctx.state.data = await DB.query('select comments.*, 0 as favorite_comment_id from comments where comments.movie_id = ?', [movieId])
    } else {
      ctx.state.data = []
    }
  }
}