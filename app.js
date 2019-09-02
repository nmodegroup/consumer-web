const ENV = require('/lib/request/env')
App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: null,
    token: '',
    baseImgUrl: ENV.host + '/source/'//设置图片域名路径
  },
})
