const DB = require('../utils/db.js')
module.exports = {
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies;")
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