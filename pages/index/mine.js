const Router = require("../../router/Router")
const app = getApp()
const settingService = require('../../service/setting')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    nickName: '',//用户微信名
    avatarUrl: '',//用户头像
    phoneLayer: false//是否显示获取手机号弹框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent("#toast")
  },
  //我的预订页
  onBookOrder: function () {
    wx.navigateTo({
      url: Router.BookOrder
    })
  },
  //我的排位页面
  onQueueOrder: function () {
    wx.navigateTo({
      url: Router.QueueOrder
    })
  },
  //换绑手机号页面
  onEditPhone: function () {
    wx.navigateTo({
      url: Router.EditPhone
    })
  },
  //我的收藏页面
  onCollect: function () {
    wx.navigateTo({
      url: Router.Collect
    })
  },
  //我的活动页面
  onActivityOrder: function () {
    wx.navigateTo({
      url: Router.ActivityOrder
    })
  },
  //拨打电话
  onCall: function () {
    wx.makePhoneCall({
      phoneNumber: '13025437441'
    })
  },
  //用户协议页面
  onProtocol: function () {
    wx.navigateTo({
      url: Router.Protocol
    })
  },
  //授权页面
  onSetting: function () {
    wx.navigateTo({
      url: Router.Setting
    })
  },
  //获取手机号
  onGetPhone: function () {
    this.setData({
      phoneLayer: true
    })
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
            this.setData({
              phone:  res
            })
          }).catch(error => {
            this.toast.showToast({
              content: error.msg
            })
          })
        },
        fail: (res) => {
          console.log('login err:', res)
        }
      })
    }
  },
  //跳转到商家端
  onMch: function () {
    wx.navigateToMiniProgram({
      appId: 'wxf07f687748208034',
      path: '/pages/home/home',
      success(res) {
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
        selected: 2
      })
    }
    this.setData({
      phone: app.globalData.phone || '',
      avatarUrl: app.globalData.userInfo.avatarUrl || '',
      nickName: app.globalData.userInfo.nickName || '',
    })
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