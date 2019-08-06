Page({

  /**
   * 页面的初始数据
   */
  data: {
    rightWidth: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setSwipeWidth()
  },
  //动态设置右侧删除滑块宽度
  setSwipeWidth: function () {
    let that = this
    //UI图屏幕宽度750删除滑块180
    let diff = 750/180
    let width = ''
    wx.getSystemInfo({
      success(res) {
        width = res.windowWidth / diff
        that.setData({
          rightWidth: width
        })
      }
    })
    console.log(this.data.rightWidth)
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