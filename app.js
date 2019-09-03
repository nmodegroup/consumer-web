const ENV = require('/lib/request/env')
App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: null,
    token: '',
    baseImgUrl: ENV.host + '/source/',//设置图片域名路径
    cid: 440300//选取城市的id 默认是深圳的id
  },
})
