const ActivityService = require('../../service/activity')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {},//活动详情
    baseUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      baseUrl: app.globalData.baseImgUrl
    })
    this.getActivityDetail(options.id)
  },
  //获取活动详情
  getActivityDetail: function (id) {
    ActivityService.getActivityDetail({id: id}).then(res =>{
      this.setData({
        activity: res
      })
    }).catch(error => {})
  },
  //拨打电话
  onCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //开始导航
  onOpenLocation: function () {
    wx.openLocation({
      latitude: this.data.activity.lat - 0,
      longitude: this.data.activity.lng - 0,
      address: this.data.activity.address
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