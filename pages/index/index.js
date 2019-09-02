const Router = require("../../router/Router")
const WxManager = require('../../utils/wxManager')
const homeService = require('../../service/home')
const app = getApp()
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
    }],
    initLocation: {//默认位置
      lng: '114.054860',
      lat: '22.532840'
    },
    baseUrl:'',//图片的url域名
    banner: [],//banner图列表
    popularBar: [],//人气酒吧推荐
    nearBar: []//附近酒吧推荐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.modal = this.selectComponent("#modal")
    this.getSetting()
    this.setData({
      baseUrl: app.globalData.baseImgUrl
    })
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
  //跳转酒吧列表页 
  onBarList: function () {
    wx.navigateTo({
      url: Router.BarList
    })
  },
  //跳转酒吧详情
  onBarDetail: function () {
    wx.navigateTo({
      url: Router.BarDetail
    })
  },
  //跳转商家搜索
  onSearch: function () {
    wx.navigateTo({
      url: Router.Search
    })
  },
  //首页-获取banner/人气酒吧/附近酒吧
  getBarList: function () {
    homeService.barList().then(res => {
      this.setData({
        banner: res.banner,
        popularBar: res.popularBar,
        nearBar: res.nearBar
      })
    }).catch(error => {
      
    })
  },
  //用户位置上报
  setLocation: function  (data) {
    homeService.setLocation(data).then(res => {
      app.globalData.m_token = res
      this.getBarList()
    }).catch(error => {

    })
  },
  //获取用户当前授权状态
  getSetting: function () {
    let that = this
    wx.getSetting({
      success(res) {
        //用户包含获取当前位置授权或者没有当前位置授权字段说明是第一次授权都调用微信获取授权 否则调用小程序设置界面去打开授权
        if (res.authSetting['scope.userLocation'] || res.authSetting['scope.userLocation'] == undefined) {
          that.modal.showModal({
            content: '您未开启定位服务，可能会影响小程序部分功能的使用，如获取推荐商家等功能。请点击“开启位置”进行授权（如未开启，系统将为您设置默认地理位置）',
            title: '温馨提示',
            cancelText: '使用默认位置',
            confirmText: '开启位置',
          })
        } else {
          that.getLocation()
        }
      }
    })
  },
  //弹框回调
  getResult: function (e) {
    if (e.detail.result == 'confirm') {
      this.getLocation()
    } else if (e.detail.result == 'cancel') {
      this.setLocation(this.data.initLocation)
    }
  },
  //获取当前位置
  getLocation: function () {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        let form = {
          lng: res.longitude,
          lat: res.latitude
        }
        that.setLocation(form)
      },
      fail(res) {
        that.setLocation(that.data.initLocation)
      }
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