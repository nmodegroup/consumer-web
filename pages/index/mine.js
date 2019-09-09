const Router = require("../../router/Router")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: app.globalData.phone
    })
  },
  //我的预订页
  onBookOrder: function () {
    wx.navigateTo({
      url: Router.BookOrder
    })
  },
  //换绑手机号页面
  onEditPhone: function () {
    wx.navigateTo({
      url: Router.EditPhone
    })
  },
  //我的收藏页面
  onCollect: function () {
    wx.navigateTo({
      url: Router.Collect
    })
  },
  //我的活动页面
  onActivityOrder: function () {
    wx.navigateTo({
      url: Router.ActivityOrder
    })
  },
  //拨打电话
  onCall: function () {
    wx.makePhoneCall({
      phoneNumber: '0755-19098421'
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})