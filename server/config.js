const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wxe7ed4c463f941c66',

    // 微信小程序 App Secret
    appSecret: 'cd443c635adbfa5ee1fd2919f2574c68',

    //使用腾讯云代理登录小程序
    useQcloudLogin: false,

    qcloudAppId: '1257887389',
    qcloudSecretId: 'AKIDytqrz2TrLwSvHbdW3cEtffnv3JgCYWLF',
    qcloudSecretKey: 'FmPbyV7rePD7KVYdhnz9jM5vbGtQoFd6',


    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: '',

        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
