const DB = require('../utils/db.js')
module.exports = {

  list: async ctx => {
    ctx.state.data = await DB.query("SELECT movies.*, count(comments.id) as total_comments FROM movies left join comments on movies.id=comments.movie_id group by movies.id order by total_comments desc")
  },

  detail: async ctx => {
    let movieId = + ctx.params.id
    let movie

    if (!isNaN(movieId)) {
      movie = (await DB.query("SELECT * FROM movies WHERE movies.id = ?", [movieId]))[0]
    } else {
      movie = {}
    }

    ctx.state.data = movie
  },

  /**
   * 获取一个随机电影
   */
  random: async ctx => {
    let results = await DB.query("select movies.title, movies.category, movies.image, comments.* from movies join comments on movies.id=comments.movie_id order by RAND() limit 1")
    if (results && results.length > 0)
      ctx.state.data = results [0]
    else{
      ctx.state.data=(await DB.query("select movies.id as movie_id, movies.title, movies.category, movies.image from movies order by RAND() limit 1"))[0]
      }
  },
}