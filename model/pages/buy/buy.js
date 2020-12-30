// pages/buy/buy.js
const WxManager = require('../../../utils/wxManager')
const ActivityService = require('../../../service/activity')
const Router = require("../../../router/Router")
const settingService = require('../../../service/setting')
const { NOT_PHONE } = require('../../../lib/request/constant')
console.log(NOT_PHONE)
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: "",
    activityId: "",
    payInfo: {},
    pic: "",
    buyNum: 1,
    price: 0,
    totalAmount: 0, // 总计
    entityAmount: 0, // 实付
    deductionAmount: 0, // 抵扣
    payParams: { 
      timeStamp: "", 
      nonceStr: "", 
      packageStr: "", 
      signType: "", 
      paySign: "" 
    },
    phoneLayer: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ activityId: options.id, baseUrl: app.globalData.baseImgUrl})
    this.toast = this.selectComponent("#toast")
    this.getPayInfo({
      id: this.data.activityId
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
  onReduceNum(){
    let { buyNum } = this.data;
    if (buyNum <= 1) return
    buyNum--;
    this.setData({ buyNum }, () => {
      this.computedAmount()
    })
  },
  onAddNum(){
    // this.toast.showToast({
    //   content: "已达到最大购买数量"
    // })
    let { buyNum } = this.data;
    if (buyNum >= 10) return
    buyNum++;
    this.setData({ buyNum }, () => {
      this.computedAmount()
    })
  },
  computedAmount(){
    let { price, buyNum, totalAmount, entityAmount, deductionAmount } = this.data;
    totalAmount = buyNum * price;
    entityAmount = totalAmount - deductionAmount;
    entityAmount = entityAmount >= 0 ? entityAmount:0;
    this.setData({ totalAmount, entityAmount })
  },
  onPayment(){ // 支付
    this.postPayment({
      id: this.data.activityId,
      num: this.data.buyNum
    })
  },
  getPayInfo(params){
    ActivityService.gtePayInfo(params).then( res => {
      console.log(res)
      this.setData({ payInfo: res, price: res.charges, pic: this.data.baseUrl + res.banner }, () => {
        this.computedAmount()
      })
    }).catch( err => {
      console.error(err)
      this.toast.showToast({
        content: err.msg
      })
    }) 
  },
  postPayment(params){
    ActivityService.postPayment(params).then(res => {
      console.log(res)
      const { timeStamp, nonceStr, signType, paySign, actOrderId } = res;
      const packageStr = res.package
      WxManager.requestPayment(
        { timeStamp, nonceStr, packageStr, signType, paySign, actOrderId },
        this.payResult,
        this.payResult
      )
    }).catch( err => {
      console.error(err)
      if (err && err.code == NOT_PHONE) {
        this.setData({ phoneLayer: true })
        return
      } 
      this.toast.showToast({
        content: err.msg
      })
    })
  },
  payResult(actOrderId, state){
    WxManager.reLaunch(Router.Payment, { actOrderId, state  })
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
            app.globalData.phone = res
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