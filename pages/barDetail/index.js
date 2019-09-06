const Router = require("../../router/Router")
const BarService = require('../../service/bar')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval: 5000,
    duration: 1000,
    baseUrl: '',
    bar: {}//酒吧详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      baseUrl: app.globalData.baseImgUrl
    })
    this.getBarDetail(options.id)
    this.getBarOrder(options.id)
  },
  //跳转酒店预订页面
  onBooking: function () {
    wx.navigateTo({
      url: Router.Booking
    })
  },
  //获取酒吧信息
  getBarDetail: function (id) {
    BarService.getBarDetail({ id: id }).then(res => {
      this.setData({
        bar: res
      })
    }).catch(error => {})
  },
  //获取酒吧预订信息
  getBarOrder: function (id) {
    BarService.getBarOrder({ id: id }).then(res => {
      console.log(res)
    }).catch(error => { })
  },
  //拨打电话
  onCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //开始导航
  onOpenLocation: function () {
    wx.openLocation({
      latitude: this.data.bar.lat - 0,
      longitude: this.data.bar.lng - 0,
      address: this.data.bar.address
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

  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res) {
    return {
      title: this.data.bar.name,
      path: 'pages/index/index' + '?barId=' + this.data.bar.id
    }
  }
})