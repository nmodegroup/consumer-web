const Router = require("../../router/Router")
const WxManager = require('../../utils/wxManager')
const homeService = require('../../service/home')
const settingService = require('../../service/setting')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval: 5000,
    duration: 1000,
    columns: [],//城市名称列表
    selAdre: false,
    initLocation: {//默认位置
      lng: '114.054860',
      lat: '22.532840'
    },
    baseUrl:'',//图片的url域名
    banner: [],//banner图列表
    popularBar: [],//人气酒吧推荐
    nearBar: [],//附近酒吧推荐
    cityList: [],//城市列表
    selLocationText: '深圳市',//选择城市
    cid: 440300,//默认深圳
    remindOrder: [],//排位订单
    activityOrder: [],//活动预订订单
    tableOrder: [],//桌位预订订单
    routerInfo: {
      barId: null,//酒吧id
      activityId: null//活动id
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.modal = this.selectComponent("#modal")
    this.toast = this.selectComponent("#toast")
    this.getSetting()
    this.getCityList()
    this.setData({
      baseUrl: app.globalData.baseImgUrl,
      'routerInfo.barId': options.barId || null,
      'routerInfo.activityId': options.activityId || null
    })
    this.wxLogin()
  },
  //微信登录
  wxLogin: function () {
    wx.login({
      success: (res) => {
        this.code = res.code
        this.getConfig()
      },
      fail: (res) => {
        console.log('login err:', res)
      }
    })
  },
  // 获取微信授权信息
  getConfig: function () {
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.getUserInfo()
        } else {
          that.routerGo()
        }
      }
    })
  },
  //微信用户信息授权
  getUserInfo() {
    var that = this;
    wx.getUserInfo({
      withCredentials: true,
      success: res => {
        app.globalData.userInfo = res.userInfo
        that.sendLogin({
          code: this.code,
          nickName: res.userInfo.nickName,
          portrait: res.userInfo.avatarUrl,
          sex: res.userInfo.gender,
          encrypted: res.encryptedData,
          iv: res.iv
        })
      },
      fail: function (res) {
      }
    })
  },
  sendLogin: function (data) {
    settingService.userLogin(data).then(res => {
      app.globalData.token = res.token //保存token
      app.globalData.phone = res.phone //保存电话号码
      app.globalData.online = true //保存以登录
      this.getOrder()
      this.routerGo()
    })
  },
  // 转发传参跳转
  routerGo: function () {
    if (this.data.routerInfo.barId) {
      WxManager.navigateTo(Router.BarDetail, { id: this.data.routerInfo.barId})
    } else if (this.data.routerInfo.activityId) {
      WxManager.navigateTo(Router.ActivityDetail, { id: this.data.routerInfo.activityId })
    }
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
  onAdreChange: function (picker, value, index) {
    console.log(picker)
  },
  //选择地址确认
  onAdreConfirm: function (e) {
    this.setData({
      selAdre: false,
      selLocationText: e.detail.value,
      cid: this.data.cityList[e.detail.index].id
    })
    app.globalData.cid = this.data.cityList[e.detail.index].id
    this.getTabBar().setData({
      show: true
    })
    this.getBarList()
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
  onBarList: function (e) {
    let webtype = e.currentTarget.dataset.webtype
    WxManager.navigateTo(Router.BarList, { type: webtype })
  },
  //跳转酒吧详情
  onBarDetail: function (e) {
    let id = e.currentTarget.dataset.item.mid || e.currentTarget.dataset.item.id//订单的酒吧id是mid字段，酒吧列表的id是id字段
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
  //跳转商家搜索
  onSearch: function () {
    wx.navigateTo({
      url: Router.Search
    })
  },
  //点击banner图跳转
  onDetail: function (e) {
    let type = e.currentTarget.dataset.item.type //关联类型（0商家 1活动）
    let objId = e.currentTarget.dataset.item.objId// 商铺或活动id
    if (type === 1) {
      WxManager.navigateTo(Router.ActivityDetail, { id: objId })
    } else if (type === 0) {
      WxManager.navigateTo(Router.BarDetail, { id: objId })
    }
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
  //首页-获取banner/人气酒吧/附近酒吧
  getBarList: function () {
    homeService.barList({ cid: this.data.cid}).then(res => {
      this.setData({
        banner: res.banner || [],
        popularBar: res.popularBar || [],
        nearBar: res.nearBar || []
      })
      if (!res.nearBar.length) {
        this.modal.showModal({
          content: '您的定位城市暂无酒吧入驻\n您可先了解其他城市的酒吧推荐',
          title: '温馨提示',
          cancelText: '重新选择',
          confirmText: '去看看',
        })
      }
    }).catch(error => {})
  },
  //获取城市列表
  getCityList: function () {
    let that = this
    homeService.getCityList().then(res => {
      that.setData({
        cityList: res
      })
      let clom = []
      for (var i = 0; i < that.data.cityList.length; i ++ ) {
        clom.push(that.data.cityList[i].name)
      }
      that.setData({
        columns: clom
      })
    }).catch(error => {
      this.toast.showToast({
        content: error.msg
      })
    })
  },
  //获取订单信息
  getOrder: function () {
    homeService.getOrder().then(res => {
      this.setData({
        tableOrder: res.tableOrder || [],
        activityOrder: res.activityOrder || [],
        remindOrder: res.remindOrder || []
      })
    }).catch(error => {
      this.toast.showToast({
        content: error.msg
      })
    })
  },
  //用户位置上报
  setLocation: function  (data) {
    homeService.setLocation(data).then(res => {
      app.globalData.m_token = res
      this.getBarList()
    }).catch(error => {
      this.toast.showToast({
        content: error.msg
      })
    })
  },
  //获取用户当前授权状态
  getSetting: function () {
    let that = this
    wx.getSetting({
      success(res) {
        //用户包含获取当前位置授权或者没有当前位置授权字段说明是第一次授权都调用微信获取授权 否则调用小程序设置界面去打开授权
        if (res.authSetting['scope.userLocation'] == undefined) {
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
      if (!this.data.nearBar.length && this.data.cid != 440300) {
        this.setData({
          cid: 440300,
          selLocationText: '深圳'
        })
        app.globalData.cid = 440300
        this.setLocation(this.data.initLocation)
      } else {
        this.getLocation()
      }
    } else if (e.detail.result == 'cancel') {
      if (!this.data.nearBar.length && this.data.cid != 440300) {
        this.onSelAdre()
      } else {
        this.setLocation(this.data.initLocation)
      }
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
    this.getOrder()
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
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      path: 'pages/index/index'
    }
  }
})