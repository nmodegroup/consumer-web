// pages/payment/payment.js
const WxManager = require('../../../utils/wxManager')
const ActivityService = require('../../../service/activity')
const Router = require("../../../router/Router")
const CONSTANT = require("../../../lib/request/constant")

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actOrderId: "",
    payState: "",
    qrcodeList: [],
    theme: "",
    qrcodeUrl: "",
    showCode: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent("#toast")
    console.log(options)
    const actOrderId = options.actOrderId;
    this.setData({ actOrderId })
    if (options.state === "success") {
      this.setData({ payState: "loading" })
      const timer = setTimeout( () => {
        clearTimeout(timer)
        this.getPayResult({
          actOrderId
        })
      }, 3000)
    } else {
      this.setData({ payState: "fail" })
    }
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
  getPayResult(params){
    ActivityService.getPayResult(params).then( res => {
      console.log(res)
      this.setData({ 
        qrcodeList: res.codes, 
        theme: res.theme, 
        qrcodeUrl: res.url,
        payState: "success" })
    }).catch( err => {
      console.error(err)
      // if ( err && Number(err.code) === CONSTANT.FAIL) {
      //   this.setData({ payState: "loading" })
      // } 
      // this.toast.showToast({
      //   content: err.msg
      // })
      wx.showToast({
        title: err.msg,
        icon: 'none',
        duration: 3000
      })
    })
  },
  handleLookMore(){
    wx.switchTab({
      url: Router.Activity
    })
  },
  handleBtnRight(){
    const { payState } = this.data;
    if (payState === "success") {
      this.setData({ showCode: true })
    } else if (payState === "fail") {
      WxManager.navigateBack()
    }
  },
  closeCodeDialog(){
    this.setData({ showCode: false })
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
  onShareAppMessage: function () {

  }
})