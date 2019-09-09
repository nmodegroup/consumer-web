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
    this.wxLogin()
  },
  // 获取用户信息
  onGotUserInfo(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      let reqData = {
        code: this.code,
        nickName: e.detail.userInfo.nickName,
        portrait: e.detail.userInfo.avatarUrl,
        sex: e.detail.userInfo.gender,
        encrypted: e.detail.encryptedData,
        iv: e.detail.iv
      }
      this.sendLogin(reqData)
    }
  },
  //微信登录
  wxLogin: function () {
    wx.login({
      success: (res) => {
        this.code = res.code
      },
      fail: (res) => {
        console.log('login err:', res)
      }
    })
  },
  sendLogin: function (data) {
    settingService.userLogin(data).then(res => {
      app.globalData.token = res.token
      app.globalData.phone = res.phone //保存电话号码
      app.globalData.online = true //保存以登录
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