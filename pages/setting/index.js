const WxManager = require('../../utils/wxManager')
const settingService = require('../../service/setting')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 微信登录
  wxLogin() {
    var that = this
    WxManager.login().then(res => {
      if (res) {
        app.globalData.code = res
        that.onSetting()
      }
    })
  },
  //授权登录
  onSetting: function () {
    let that = this
    WxManager.getUserInfo().then(res => {
      app.globalData.userInfo = res.userInfo
      that.userLogin({
        code: app.globalData.code,
        nickName: res.userInfo.nickName,
        portrait: res.userInfo.avatarUrl,
        sex: res.userInfo.gender,
        encrypted: res.encryptedData,
        iv: res.iv
      })
    }).catch(() =>{
      that.setData({
        showDialog:  true
      })
    })
  },
  userInfoHandler: function (e) {
    let that = this
    let res = e.detail
    if (res.userInfo == undefined) {
      wx.showToast({
        title: "请允许用户授权",
        icon: 'loading'
      })
    } else {
      that.setData({
        showDialog: false
      })
      app.globalData.userInfo = res.userInfo
      that.userLogin({
        code: app.globalData.code,
        nickName: res.userInfo.nickName,
        portrait: res.userInfo.avatarUrl,
        sex: res.userInfo.gender,
        encrypted: res.encryptedData,
        iv: res.iv
      })
    }
  },
  //用户登录接口
  userLogin(data) {
    settingService.userLogin(data).then(res => {
      wx.navigateBack({
        delta: 1
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})