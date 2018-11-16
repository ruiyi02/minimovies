/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

//get list of movies
router.get('/movie', controllers.movie.list)

//get movie detail
router.get('/movie/:id', controllers.movie.detail)

//get a randow comment
router.get('/comment/random', controllers.comment.random)

// 添加评论
router.put('/comment', validationMiddleware, controllers.comment.add)

// 获取评论列表
router.get('/comment', controllers.comment.list)

// 添加收藏评论
router.put('/favorite', validationMiddleware, controllers.favorite.add)

// 删除收藏评论
router.delete('/favorite', validationMiddleware, controllers.favorite.delete)

// 获取收藏评论列表
router.get('/favorite', validationMiddleware, controllers.favorite.list)

module.exports = router
