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
    let voice = ctx.request.body.voice || null
    let voice_duration = ctx.request.body.voice_duration || null
    let newComment
    if (!isNaN(movieId)) {
      let result = await DB.query('INSERT INTO comments(user, username, avatar, content, voice, voice_duration, movie_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [user, username, avatar, content, voice, voice_duration, movieId])
      //get new record id
      let commentId = result.insertId
      // return new comment
      newComment = (await DB.query("select comments.*, movies.title, movies.category, movies.image from comments join movies on movies.id=comments.movie_id and comments.id=?", [commentId]))[0]
      ctx.state.data = newComment
    }
    //ctx.state.data = {}
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
        ctx.state.data = await DB.query('select comments.*, IFNULL(favorite_comments.comment_id, 0) as favorite_comment_id from comments left join favorite_comments on favorite_comments.comment_id=comments.id and favorite_comments.user=? where comments.movie_id = ? order by comments.create_time desc', [user, movieId])
      }else
        ctx.state.data = await DB.query('select comments.*, 0 as favorite_comment_id from comments where comments.movie_id = ? order by comments.create_time desc', [movieId])
    } else {
      ctx.state.data = []
    }
  },

/**
   * 获取详细评论
   */
  detail: async ctx => {
    let commentId = + ctx.params.id
    let comment

    if (!isNaN(commentId)) {
      comment = (await DB.query("select comments.*, movies.title, movies.category, movies.image from comments join movies on movies.id=comments.movie_id and comments.id=?", [commentId]))[0]
    } else {
      comment = {}
    }

    ctx.state.data = comment
  },

 /**
   * 获取一个随机评论
   */
  random: async ctx => {
    ctx.state.data = (await DB.query("select comments.*, movies.title, movies.category, movies.image from comments join movies on movies.id=comments.movie_id order by RAND() limit 1"))[0]
  },

  /**
   * 获取我的评论列表
   */
  published: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    ctx.state.data = await DB.query("select comments.*, movies.title, movies.category, movies.image from comments join movies on movies.id=comments.movie_id and comments.user=? order by comments.create_time desc", [user])
  }


}