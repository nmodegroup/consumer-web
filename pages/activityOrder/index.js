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
    goMore: true, // 加载更多,
    validTime: "",
    qrCodeUrl: "",
    codes: [],
    codesShow: false,
    qrCodeShow: false
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
    }).catch(error => {
        this.toast.showToast({
          content: error.msg
        })
      })
  },
  //取消预订
  onCancel: function (e) {
    const dataset = e.currentTarget.dataset;
    if (dataset.status == 4) {
      this.getOrderTicketsCode({
        id: dataset.id
      })
      return 
    }
    this.setData({
      selId: dataset.id
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
        icon: 'success'
      })
      this.getOrderList()
    }).catch(error => {
        this.toast.showToast({
          content: error.msg
        })
      })
  },
  //活动详情页
  onActivityDetail: function (e) {
    let id = e.currentTarget.dataset.item.aid
    let isForbid = e.currentTarget.dataset.item.isForbid
    if (isForbid) {
      this.toast.showToast({
        content: '活动已下架，暂时无法查看',
        icon: 'warn'
      })
    } else {
      WxManager.navigateTo(Router.ActivityDetail, { id: id })
    }
  },
  // 劵码
  getOrderTicketsCode(params){
    let that = this
    mineService.getOrderTicketsCode(params).then(res => {
      console.log(res)
      let { validTime, qrCodeUrl, codes, codesShow } = that.data;
      validTime = res.validTime;
      qrCodeUrl = res.url;
      codes = res.codes;
      codesShow = true;
      that.setData({ validTime, qrCodeUrl, codes, codesShow})

    }).catch(error => {
      console.error(error)
      if (error && error.msg) {
        this.toast.showToast({
          content: error.msg
        })
      }
    })
  },
  closeDialog(){
    this.setData({ codesShow: false })
  },
  closeCodeDialog() {
    this.setData({ qrCodeShow: false })
  },
  useCode(){
    this.setData({ codesShow: false, qrCodeShow: true })
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