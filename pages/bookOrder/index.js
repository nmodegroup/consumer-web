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
    list: [],
    query: {
      pageNum: 1,
      pageSize: 4
    },
    moreBtn: false,//正在载入更多提示
    noMoreBtn: false,//没有更多提示
    goMore: true, // 加载更多
    tabType: 1//1我的预订 2我的排位
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
    mineService.getTableOrder(this.data.query).then(res => {
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
  onTab: function (e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      tabType: type,
      'query.pageNum': 1,
      goMore: true,
      moreBtn: false,
      noMoreBtn: false,
      list: []
    })
    if (this.data.tabType == 1) {
      this.getOrderList()
    } else if (this.data.tabType == 2) {
      this.getRemindList()
    }
  },
  //modal弹框回调
  getResult: function (e) {
    if (e.detail.result == 'confirm') {
      if (this.data.tabType == 1) {
        this.cancelBooking()
      } else if (this.data.tabType == 2) {
        this.onRemindCancel()
      }
      
    }
  },
  //取消预订接口
  cancelBooking: function () {
    BarService.cancelBarOrder({ id: this.data.selId }).then(res => {
      this.toast.showToast({
        content: '您已取消预订',
        icon: 'success'
      })
      this.setData({
        'query.pageNum': 1,
        goMore: true,
        moreBtn: false,
        noMoreBtn: false
      })
      this.getOrderList()
    }).catch(error => { })
  },
  //跳转酒吧详情
  onBarDetail: function (e) {
    let id = e.currentTarget.dataset.item.mid
    let isForbid = e.currentTarget.dataset.item.isForbid //是否禁用（true 已被禁用  false 未被禁用）
    if (isForbid) {
      this.toast.showToast({
        content: '该商家已下架，暂时无法查看',
        icon: 'warn'
      })
    } else {
      WxManager.navigateTo(Router.BarDetail, { id: id })
    }
  },

  //获取我的预订列表
  getRemindList: function () {
    let that = this
    mineService.getRemindOrder(this.data.query).then(res => {
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
  onRemindCancel: function (e) {
    this.setData({
      selId: e.currentTarget.dataset.id
    })
    this.modal.showModal({
      content: '确定要取消提醒吗？',
      title: '温馨提示',
      cancelText: '再看看',
      confirmText: '确认取消',
    })
  },
  //取消排位接口
  cancelRemind: function () {
    BarService.cancelRemind({ id: this.data.selId }).then(res => {
      this.toast.showToast({
        content: '您已取消提醒',
        icon: 'success'
      })
      this.setData({
        'query.pageNum': 1,
        goMore: true,
        moreBtn: false,
        noMoreBtn: false
      })
      this.getRemindList()
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
    if (this.data.tabType == 1) {
      this.getOrderList()
    } else if (this.data.tabType == 2) {
      this.getRemindList()
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
    this.setData({
      'query.pageNum': 1,
      goMore: true,
      moreBtn: false,
      noMoreBtn: false
    })
    if (this.data.tabType == 1) {
      this.getOrderList()
    } else if (this.data.tabType == 2) {
      this.getRemindList()
    }
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
      if (this.data.tabType == 1) {
        this.getOrderList()
      } else if (this.data.tabType == 2) {
        this.getRemindList()
      }
    }
  }
})