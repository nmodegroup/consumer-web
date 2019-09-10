const Router = require("../../router/Router")
const WxManager = require('../../utils/wxManager')
const mineService = require('../../service/mine')
const BarService = require('../../service/bar')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rightWidth: '',
    list: [],//列表
    baseUrl: '',//图片的url域名
    query: {
      pageNum: 1,
      pageSize: 6
    },
    moreBtn: false,//正在载入更多提示
    noMoreBtn: false,//没有更多提示
    goMore: true, // 加载更多
    delId: ''//删除的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setSwipeWidth()
    this.modal = this.selectComponent("#modal")
    this.toast = this.selectComponent("#toast")
    this.setData({
      baseUrl: app.globalData.baseImgUrl
    })
  },
  //动态设置右侧删除滑块宽度
  setSwipeWidth: function () {
    let that = this
    //UI图屏幕宽度750删除滑块180
    let diff = 750/180
    let width = ''
    wx.getSystemInfo({
      success(res) {
        width = res.windowWidth / diff
        that.setData({
          rightWidth: width
        })
      }
    })
  },
  //删除收藏
  onDel: function (event) {
    this.instance = event.detail.instance
    this.setData({
      delId: event.currentTarget.dataset.id
    })
    this.modal.showModal({ 
      content: '确定要删除此收藏吗？\n删除就没有了哦~',
      title: '温馨提示',
      cancelText: '拒绝',
      confirmText: '残忍删除',
      hideCancel: true
    })
  },
  //获取活动列表
  getCollect: function () {
    let that = this
    mineService.getCollectOrder(this.data.query).then(res => {
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
  //删除操作回调 confirm确认 cancel取消
  getResult: function (e) {
    this.instance.close()
    if (e.detail.result == 'confirm') {
      BarService.cancelCollect({ id: this.data.delId }).then(res => {
        this.getCollect()
        this.toast.showToast({
          content: '删除成功',
          icon: 'success'
        })
      }).catch(error => {})
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
    this.getCollect()
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
    this.getCollect()
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
      this.getCollect()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})