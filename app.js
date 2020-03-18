const ENV = require('/lib/request/env')
const ald = require('./utils/ald-stat.js')
App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: {
      avatarUrl: '',
      nickName: ''
    },
    token: '',
    baseImgUrl: ENV.sourceHost + '/',//设置图片域名路径
    cid: 440300,//选取城市的id 默认是深圳的id
    phone: '',//当前用户手机号
    online: false, //是否登录
    divination: "", // 酒运测试结果
    divinationShow: true // 控制酒运测试弹层是否显示
  },
})
