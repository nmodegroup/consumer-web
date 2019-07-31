Page({

  /**
   * 页面的初始数据
   */
  data: {
    distanceList: ['附近全部', '0.5km', '1km', '2km', '3km', '5km'],
    showDropDown: false,
    type: ''
  },
  searchItem: [[{
      text: '附近全部',
      id:  1
    },
    {
      text: '0.5km',
      id: 1
    },
    {
      text: '1km',
      id: 1
    },
    {
      text: '2km',
      id: 1
    },
    {
      text: '3km',
      id: 1
    },
    {
      text: '5km',
      id: 1
    }],[{
      text: '全部类型',
      id: 1
    },
    {
      text: '餐吧',
      id: 1
    },
    {
      text: '清吧',
      id: 1
    },
    {
      text: '闹吧',
      id: 1
    }],[{
      text: '全部类型',
      id: 1
    },
    {
      text: '距离最近',
      id: 1
    },
    {
      text: '人气最高',
      id: 1
    },
    {
      text: '人均从高到低',
      id: 1
    },
    {
      text: '人均从低到高',
      id: 1
    }]],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //切换下拉选择框
  onShowDropDown: function (e) {
    let type = e.currentTarget.dataset.type
    let list = []
    list = this.searchItem[type - 1]
    if (type == this.data.type) {
      this.setData({
        showDropDown: !this.data.showDropDown,
        distanceList: list
      })
    } else {
      this.setData({
        showDropDown: true,
        type: e.currentTarget.dataset.type,
        distanceList: list
      })
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

  }
})