// pages/editPhone/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeBtn: '获取验证码',
    runing: true//是否可以点击获取验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取验证码
  getCode: function () {
    if (this.data.code.phone) {
      let second = e.currentTarget.dataset.second
      let that = this
      if (validate.valiPhone(this.data.code.phone)) {
        if (that.data.runing) {
          let reqData = {
            phone: that.data.code.phone.replace(/\s+/g, ""),
            type: that.data.codeApi.type
          }
          let requestData = {
            url: this.data.codeApi.api,
            data: reqData,
            success: res => {
              that.setData({
                runing: false,
                codeBtn: second + 's',
                focusCode: true
              })
              that.data.timer = setInterval(function () {
                --second
                that.setData({
                  codeBtn: second + 's'
                })
                if (second <= 0) {
                  clearTimeout(that.data.timer)
                  that.setData({
                    runing: true,
                    codeBtn: '重新获取'
                  })
                }
              }, 1000)
            }
          }
          ApiManager.send(requestData, this.data.codeApi.method)
        }
      }
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