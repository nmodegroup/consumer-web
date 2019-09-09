const ActivityService = require('../../service/activity')
const WxManager = require('../../utils/wxManager')
const Router = require("../../router/Router")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],//桌位列表
    activity: {},
    selId: '',//选择的桌位id
    selIdx: '',//选择的座位下标
    form: {
      id: '',//活动id
      tid: '',//桌位区域id，限额类型为按已有桌位限制时必传
      tableNum: '',//桌位人数，限额类型为按已有桌位限制时必传
      tableAreaName: ''//桌位区域名称，限额类型为按已有桌位限制时必传
    },
    phoneLayer: false  //是否展示授权手机号弹框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent("#toast")
    this.getTable(options)
    wx.setNavigationBarTitle({
      title: options.theme
    })
  },
  //获取桌位信息
  getTable: function (data) {
    ActivityService.getTable({id: data.id}).then(res => {
      this.setData({
        list: res,
        'form.id': data.id
      })
    }).catch(error => {})
  },
  //选择桌位
  onSelTable: function (e) {
    if (!e.currentTarget.dataset.num) {
      this.toast.showToast({
        content: '当前桌位已满请重新选择',
        icon: 'warn'
      })
    } else {
      this.setData({
        selId: e.currentTarget.dataset.id,
        selIdx: e.currentTarget.dataset.idx,
        'form.tableNum': e.currentTarget.dataset.tablenum,
        'form.tableAreaName': e.currentTarget.dataset.name,
      })
    }
  },
  //预定
  onBooking: function () {
    this.setData({
      'form.tid' : this.data.selId
    })
    if (!this.data.form.tid) {
      this.toast.showToast({
        content: '请选择桌位',
        icon: 'warn'
      })
    } else {
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
    }
  },
  //发起预订接口
  activityBooking: function () {
    ActivityService.activityBooking(this.data.form).then(res => {
      this.toast.showToast({
        content: '您已成功预定活动名额',
        icon: 'success'
      })
      setTimeout(()=>{
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.getActivityDetail()
        wx.navigateBack({
          delta: 1
        })
      },1500)
    }).catch(error => { })
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
          }).catch(error => { })
        },
        fail: (res) => {
          console.log('login err:', res)
        }
      })
    }
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
  onShareAppMessage: function () {

  }
})