const Router = require("../../router/Router")
const WxManager = require('../../utils/wxManager')
const mineService = require('../../service/mine')
const ActivityService = require('../../service/activity')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    query: {
      pageNum: 1,
      pageSize: 6
    },
    moreBtn: false,//正在载入更多提示
    noMoreBtn: false,//没有更多提示
    goMore: true // 加载更多,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent("#toast")
    this.modal = this.selectComponent("#modal")
  },
  //获取我的预订列表
  getOrderList: function () {
    let that = this
    mineService.getActivityOrder(this.data.query).then(res => {
      if (that.data.query.pageNum == 1) {
        that.setData({
          list: res.list
        })
      } else {
        if (that.data.list.length < res.totalSize) {
          let list = that.data.list
          list = list.concat(res.list)
          that.setData({
            list: list,
            goMore: true,
            moreBtn: false,
            noMoreBtn: false
          })
        } else {
          that.setData({
            goMore: false,
            moreBtn: false,
            noMoreBtn: true
          })
        }
      }
    }).catch(error => { })
  },
  //取消预订
  onCancel: function (e) {
    this.setData({
      selId: e.currentTarget.dataset.id
    })
    this.modal.showModal({
      content: '确定要取消预订吗？取消后可能导致没有名额了哦~',
      title: '温馨提示',
      cancelText: '再看看',
      confirmText: '确认取消',
    })
  },
  //modal弹框回调
  getResult: function (e) {
    if (e.detail.result == 'confirm') {
      this.cancelBooking()
    }
  },
  //取消预订接口
  cancelBooking: function () {
    ActivityService.cancelBooking({ id: this.data.selId }).then(res => {
      this.toast.showToast({
        content: '您已取消预订',
        icon: 'warn'
      })
      this.getOrderList()
    }).catch(error => { })
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
    this.getOrderList()
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
    this.setData({
      'query.pageNum': 1,
      goMore: true,
      moreBtn: false,
      noMoreBtn: false
    })
    this.getOrderList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    if (this.data.goMore) {
      this.setData({
        moreBtn: true,
        'query.pageNum': that.data.query.pageNum + 1,
        goMore: false
      })
      this.getOrderList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})