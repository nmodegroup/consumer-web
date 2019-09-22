const ENV = require('/lib/request/env')
App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: {
      avatarUrl: '',
      nickName: ''
    },
    token: '',
    baseImgUrl: ENV.host + '/source/',//设置图片域名路径
    cid: 440300,//选取城市的id 默认是深圳的id
    phone: '',//当前用户手机号
    online: false //是否登录
  },
})
