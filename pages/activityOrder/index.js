const Router = require("../../router/Router")
const WxManager = require('../../utils/wxManager')
const mineService = require('../../service/mine')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    query: {
      pageNum: 1,
      pageSize: 4
    },
    moreBtn: false,//正在载入更多提示
    noMoreBtn: false,//没有更多提示
    goMore: true // 加载更多,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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