const Router = require("../../router/Router")
const WxManager = require('../../utils/wxManager')
const mineService = require('../../service/mine')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeBtn: '获取验证码',
    runing: true,//是否可以点击获取验证码
    form: {
      newPhone: '',
      newCode: '',
      oldCode: ''
    },
    code: {
      phone: '',
      code: ''
    },
    type: 1,//1用户端小程序旧手机验证发送短信, 2用户端小程序新手机绑定发送短信
    oldCode: ''//旧验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent("#toast")
  },
  //获取验证码
  getCode: function (e) {
    let that = this
    let rmobile = /^1(3|4|5|7|8|6|9)\d{9}$/
    if (!rmobile.test(this.data.code.phone)) {
      this.toast.showToast({
        content: '请填写正确的手机号码',
        icon: 'warn'
      })
    } else {
      let second = e.currentTarget.dataset.second
      if (that.data.runing) {
        let form = {
          phone: that.data.code.phone,
          type: that.data.type
        }
        mineService.getCode(form).then(res => {
          that.setData({
            runing: false,
            codeBtn: second + 's'
          })
          that.timer = setInterval(function () {
            --second
            that.setData({
              codeBtn: second + 's'
            })
            if (second <= 0) {
              clearTimeout(that.timer)
              that.setData({
                runing: true,
                codeBtn: '重新获取'
              })
            }
          }, 1000)
        }).catch(error => { })
      }
    }
  },
  //手机号码
  bindPhoneInput: function (e) {
    this.setData({
      'code.phone': e.detail.value
    })
  },
  //验证码
  bindCodeInput: function (e) {
    this.setData({
      'code.code': e.detail.value
    })
  },
  //提交
  onConfirm: function () {
    let rmobile = /^1(3|4|5|7|8|6|9)\d{9}$/
    if (!rmobile.test(this.data.code.phone)) {
      this.toast.showToast({
        content: '请填写正确的手机号码',
        icon: 'warn'
      })
    } else if (!this.data.code.code) {
      this.toast.showToast({
        content: '请输入验证码',
        icon: 'warn'
      })
    } else {
      console.log(this.data.type)
      if (this.data.type == 1) {//下一步
        mineService.validatePhone(this.data.code).then(res => {
          clearTimeout(this.timer)
          this.setData({
            type: 2,
            'form.oldCode': this.data.code.code,
            'code.phone': '',
            'code.code': '',
            runing: true,
            codeBtn: '获取验证码'
          })
        }).catch(error => {})
      } else if (this.data.type == 2) {//完成
        this.setData({
          'form.newPhone': this.data.code.phone,
          'form.newCode': this.data.code.code
        })
        mineService.bindPhone(this.data.form).then(res => {
          this.toast.showToast({
            content: '您的手机号换绑成功',
            icon: 'success'
          })
          setTimeout(() => {
            app.globalData.phone = this.data.form.newPhone
            wx.navigateBack({
              delta: 1
            })
          })
        }).catch(error => { })
      }
    }
  },
  //拨打电话
  onCall: function () {
    wx.makePhoneCall({
      phoneNumber: '13025437441'
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})