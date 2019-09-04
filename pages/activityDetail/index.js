const ActivityService = require('../../service/activity')
const WxManager = require('../../utils/wxManager')
const Router = require("../../router/Router")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {},//活动详情
    baseUrl: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent("#toast")
    this.setData({
      baseUrl: app.globalData.baseImgUrl,
      id: options.id
    })
    this.getActivityDetail()
  },
  //获取活动详情
  getActivityDetail: function () {
    ActivityService.getActivityDetail({id: this.data.id}).then(res =>{
      this.setData({
        activity: res
      })
    }).catch(error => {})
  },
  //拨打电话
  onCall: function (e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //开始导航
  onOpenLocation: function () {
    wx.openLocation({
      latitude: this.data.activity.lat - 0,
      longitude: this.data.activity.lng - 0,
      address: this.data.activity.address
    })
  },
  //预定
  onBooking: function () {
    let activity = this.data.activity
    if (activity.appointStatus == 0) {//我的预订状态(0已预定 1已取消  2未预定)，登陆后才有此字段
      this.cancelBooking()
    } else {
      if (activity.onStatus == 1 || activity.num == 0) {//onStatus启用状态(0开启 1关闭)，当num=0时表示已约满
        return
      } else if (activity.quotaType == 1) {//限制预订数量类型（0不限 1按系统已有桌位限制 2按固定名额限制）
        WxManager.navigateTo(Router.BookingActivity, { id: activity.id})
      } else {
        this.setBooking()
      }
    }
  },
  //发起活动预订接口
  setBooking: function () {
    ActivityService.activityBooking({id: this.data.id}).then(res => {
      this.toast.showToast({
        content: '您已成功预定活动名额',
        icon: 'success'
      })
      this.getActivityDetail()
    }).catch(error => { })
  },
  //取消预订接口
  cancelBooking: function () {
    ActivityService.cancelBooking({id: this.data.activity.id}).then(res => {
      this.toast.showToast({
        content: '您已取消预订可能导致无法再次预订哦',
        icon: 'warn'
      })
      this.getActivityDetail()
    }).catch(error => {})
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
      title: this.data.activity.theme,
      path: 'pages/index/index' + '?activityId=' + this.data.activity.id
    }
  }
})