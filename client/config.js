/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://issefeys.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        //get movie list
        movieListUrl: `${host}/weapp/movie`,

        //get movie detail
        movieDetailUrl: `${host}/weapp/movie/`,

        // 获取随机评论
        commentRandomUrl: `${host}/weapp/comment/random`,

        // 获取我的评论
        commentPublishedUrl: `${host}/weapp/comment/published`,

        // 上传文件接口
        uploadUrl: `${host}/weapp/upload`,

         // 添加评论
        addCommentUrl: `${host}/weapp/comment`,

        // 获取评论列表
        commentListUrl: `${host}/weapp/comment`,

        // 获取收藏的评论列表
        favoriteListUrl: `${host}/weapp/favorite`,

        // 添加收藏评论
        addFavoritetUrl: `${host}/weapp/favorite`,

         // 删除收藏评论
        deleteFavoritetUrl: `${host}/weapp/favorite`
    }
};

module.exports = config;
