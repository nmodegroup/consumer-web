const homeService = require('../../service/home')
const WxManager = require('../../utils/wxManager')
const Router = require("../../router/Router")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moreBtn: false,//正在载入更多提示
    noMoreBtn: false,//没有更多提示
    goMore: true, // 加载更多
    noResult: false,//搜索无结果提示
    list: [],
    query: {
      pageNum: 1,
      pageSize: 8,
      queryStr: '',//关键字
      webType: 0,//页面入口类型（0搜索  1人气酒吧  2附近酒吧）
      cid: ''//定位城市id
    },
    historyList: []//历史记录列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.modal = this.selectComponent("#modal")
    this.toast = this.selectComponent("#toast")
    this.setData({
      'query.cid': app.globalData.cid,
      baseUrl: app.globalData.baseImgUrl
    })
    this.getHistoryList()
  },
  //监听输入框搜索
  onInput: function (e) {
    this.setData({
      'query.queryStr': e.detail.value
    })
  },
  //点击历史记录搜索商家
  onGetHistory: function (e) {
    this.setData({
      'query.queryStr': e.currentTarget.dataset.key
    })
    this.getBarList()
  },
  //获取酒吧列表
  getBarList: function () {
    let that = this
    homeService.getBarList(this.data.query).then(res => {
      if (that.data.query.pageNum == 1) {
        that.setData({
          list: res.list
        })
      } else {
        if (that.data.list.length < res.totalCount) {
          let list = that.data.list
          list = list.concat(res.list)
          that.setData({
            list: list,
            goMore: true,
            moreBtn: false
          })
        } else {
          that.setData({
            goMore: false,
            moreBtn: false,
            noMoreBtn: true
          })
        }
      }
      that.setData({
        historyList: [],
        noResult: !!res.list
      })
    }).catch(error => { })
  },
  //点击搜索按钮或键盘搜索按钮
  getSearchList: function () {
    this.setData({
      'query.pageNum': 1,
      noMoreBtn: false
    })
    this.getBarList()
  },
  //获取历史列表
  getHistoryList: function () {
    homeService.getHistoryList().then(res => {
      this.setData({
        historyList: res
      })
    }).catch(error => { })
  },
  //跳转酒吧详情
  onBarDetail: function (e) {
    let id = e.currentTarget.dataset.id
    WxManager.navigateTo(Router.BarDetail, { id: id })
  },
  //跳转酒吧详情
  onBarDetail: function (e) {
    let id = e.currentTarget.dataset.id
    WxManager.navigateTo(Router.BarDetail, { id: id })
  },
  //删除历史记录确认
  onLayer: function () {
    this.modal.showModal({
      content: '确认要删除历史搜索记录吗？',
      title: '温馨提示',
      cancelText: '取消',
      confirmText: '确认'
    })
  },
  //modal弹框回调
  getResult: function (e) {
    if (e.detail.result == 'confirm') {
      this.onDelHistory()
    }
  },
  //删除记录历史
  onDelHistory: function () {
    console.log(111)
    homeService.delHistoryList().then(res => {
      this.toast.showToast({
        content: '历史记录删除成功',
        icon: 'success'
      })
      this.getHistoryList()
    }).catch(error => { })
  },
  onResetInput: function () {
    this.setData({
      'query.queryStr': ''
    })
    this.getBarList()
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
    this.setData({
      'query.pageNum': 1,
      goMore: true,
      moreBtn: false,
      noMoreBtn: false
    })
    this.getBarList()
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
      this.getBarList()
    }
  }
})