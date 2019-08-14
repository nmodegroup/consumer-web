const Router = require("../../router/Router")
const WxManager = require('../../utils/wxManager')
const homeService = require('../../service/home')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    interval: 5000,
    duration: 1000,
    columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    selAdre: false,
    bookingList: [{
      name: '深圳BBR酒吧',
      num: 8
    },{
      name: '深圳BBR酒吧',
      num: 8
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  //选择地址
  onSelAdre: function () {
    this.setData({
      selAdre: true
    })
    this.getTabBar().setData({
      show: false
    })
  },
  //选择地址组件改变
  onAdreChange: function () {

  },
  //选择地址确认
  onAdreConfirm: function () {
    this.setData({
      selAdre: false
    })
    this.getTabBar().setData({
      show: true
    })
  },
  //选择地址取消
  onAdreCancel: function () {
    this.setData({
      selAdre: false
    })
    this.getTabBar().setData({
      show: true
    })
  },
  //酒吧列表页 
  onBarList: function () {
    wx.navigateTo({
      url: Router.BarList
    })
  },
  //酒吧详情
  onBarDetail: function () {
    wx.navigateTo({
      url: Router.BarDetail
    })
  },
  //商家搜索
  onSearch: function () {
    wx.navigateTo({
      url: Router.Search
    })
  },
  //首页-获取banner/人气酒吧/附近酒吧
  getBarList: function () {
    homeService.barList().then(res => {
      console.log(res)
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.getBarList()
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
    
  }
})