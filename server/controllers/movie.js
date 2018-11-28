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
  }
}