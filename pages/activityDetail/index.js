const ActivityService = require('../../service/activity')
const settingService = require('../../service/setting')
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
    id: '',
    phoneLayer: false  //是否展示授权手机号弹框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent("#toast")
    this.modal = this.selectComponent("#modal")
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
      this.modal.showModal({
        content: '确定要取消预订吗？取消后可能导致没有名额了哦~',
        title: '温馨提示',
        cancelText: '再看看',
        confirmText: '确认取消',
      })
    } else {
      if (activity.status != 2) {// //0已约满  1已暂停  2预定中  3活动中  4活动已结束 只有status=2的时候能预定活动
        this.toast.showToast({
          content: '当前活动不可预订',
          icon: 'warn'
        })
      } else if (activity.quotaType == 1) {//限制预订数量类型（0不限 1按系统已有桌位限制 2按固定名额限制）
        WxManager.navigateTo(Router.BookingActivity, { id: activity.id, theme: activity.theme})
      } else {
        this.setBooking()
      }
    }
  },
  //发起活动预订接口
  setBooking: function () {
    if (app.globalData.online) {//如果以登录
      if (!app.globalData.phone) {//判断登录接口有没有返回手机号 没有返回获取手机号授权
        this.setData({
          phoneLayer: true
        })
      } else {
        this.activityBooking()
      }
    } else {
      this.activityBooking()
    }
  },
  //发起预订接口
  activityBooking: function () {
    ActivityService.activityBooking({ id: this.data.id }).then(res => {
      this.toast.showToast({
        content: '您已成功预定活动名额',
        icon: 'success'
      })
      this.getActivityDetail()
    }).catch(error => { })
  },
  //modal弹框回调
  getResult: function (e) {
    if (e.detail.result == 'confirm') {
      this.cancelBooking()
    }
  },
  //取消预订接口
  cancelBooking: function () {
    ActivityService.cancelBooking({ id: this.data.activity.oid}).then(res => {
      this.toast.showToast({
        content: '您已取消预订',
        icon: 'warn'
      })
      this.getActivityDetail()
    }).catch(error => {})
  },
  //获取手机号授权弹框取消按钮
  phoneCancel: function () {
    this.setData({
      phoneLayer: false
    })
  },
  //获取手机号
  getPhoneNumber: function (e) {
    this.setData({
      phoneLayer: false
    })
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      wx.login({
        success: (res) => {
          let form = {
            code: res.code,
            encrypted: e.detail.encryptedData,
            iv: e.detail.iv
          }
          settingService.setPhone(form).then(res => {
            app.globalData.phone = res
          }).catch(error => {})
        },
        fail: (res) => {
          console.log('login err:', res)
        }
      })
    }
  },
  //跳转酒吧详情
  onBarDetail: function (e) {
    let id = e.currentTarget.dataset.id
    WxManager.navigateTo(Router.BarDetail, { id: id })
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