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
        movieDetailUrl: `${host}/weapp/movie/`
    }
};

module.exports = config;
