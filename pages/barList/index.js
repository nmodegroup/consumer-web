const homeService = require('../../service/home')
const WxManager = require('../../utils/wxManager')
const Router = require("../../router/Router")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    distanceList: [],//下拉框选项
    showDropDown: false,
    list: [],//酒吧列表
    moreBtn: false,//正在载入更多提示
    noMoreBtn: false,//没有更多提示
    goMore: true, // 加载更多
    noResult: false,//搜索无结果提示
    type: '',
    query: {
      pageNum: 1,
      pageSize: 8,
      queryStr: '',//关键字
      webType: '',//页面入口类型（0搜索  1人气酒吧  2附近酒吧）
      cid: '',//定位城市id
      nearType: 0,//附近类型（0 所有   1 500m   2 1000m   3 2000m   4 3000m   5 5000m  6 其它）
      barType: 0,//全部类型 （0所有 1餐吧 2清吧 3其它）
      sortType: 0,//排序类型 （0智能排序  1距离最近  2人气最高  3人均从高到低  4人均从低到高）
    },
  },
  searchItem: [[{
      text: '附近全部',
      id:  0,
      selType: 1 // 1 附近  2：酒吧类型 3：智能排序
    },
    {
      text: '0.5km',
      id: 1,
      selType: 1
    },
    {
      text: '1km',
      id: 2,
      selType: 1
    },
    {
      text: '2km',
      id: 3,
      selType: 1
    },
    {
      text: '3km',
      id: 4,
      selType: 1
    },
    {
      text: '5km',
      id: 5,
      selType: 1
    },{
      text: '其他',
      id: 6,
      selType: 1
    }],[{
      text: '全部类型',
      id: 0,
      selType: 2
    },
    {
      text: '餐吧',
      id: 1,
      selType: 2
    },
    {
      text: '清吧',
      id: 2,
      selType: 2
    },
    {
      text: '其他',
      id: 3,
      selType: 2
    }],[{
      text: '智能排序',
      id: 0,
      selType: 3
    },
    {
      text: '距离最近',
      id: 1,
      selType: 3
    },
    {
      text: '人气最高',
      id: 2,
      selType: 3
    },
    {
      text: '人均从高到低',
      id: 3,
      selType: 3
    },
    {
      text: '人均从低到高',
      id: 4,
      selType: 3
    }]],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '人气酒吧'
      })
    } else if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '附近酒吧'
      })
    }
    this.setData({
      'query.webType': options.type,
      'query.cid': app.globalData.cid
    })
    this.getBarList()
  },
  //切换下拉选择框
  onShowDropDown: function (e) {
    let type = e.currentTarget.dataset.type
    let list = []
    list = this.searchItem[type - 1]
    if (type == this.data.type) {
      this.setData({
        showDropDown: !this.data.showDropDown,
        distanceList: list,
      })
    } else {
      this.setData({
        showDropDown: true,
        type: e.currentTarget.dataset.type,
        distanceList: list
      })
    }
  },
  //隐藏下拉选择
  onHideDropDown: function () {
    this.setData({
      showDropDown: false
    })
  },
  //选择条件
  onSel: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.seltype == 1) {
      this.setData({
        'query.nearType': e.currentTarget.dataset.id,
        'query.pageNum': 1
      })
    } else if (e.currentTarget.dataset.seltype == 2) {
      this.setData({
        'query.barType': e.currentTarget.dataset.id,
        'query.pageNum': 1
      })
    } else if (e.currentTarget.dataset.seltype == 3) {
      this.setData({
        'query.sortType': e.currentTarget.dataset.id,
        'query.pageNum': 1
      })
    }
    this.getBarList()
  },
  //获取酒吧列表
  getBarList: function () {
    let that = this
    homeService.getBarList(this.data.query).then(res => {
      if (that.data.query.pageNum == 1) {
        that.setData({
          list: res.list
        })
      } else {
        if (that.data.list.length < res.totalCount) {
          let list = that.data.list
          list = list.concat(res.list)
          that.setData({
            list: list,
            goMore: true,
            moreBtn: false
          })
        } else {
          that.setData({
            goMore: false,
            moreBtn: false,
            noMoreBtn: true
          })
        }
      }
      that.setData({
        historyList: [],
        noResult: !!res.list
      })
    }).catch(error => { })
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
    this.setData({
      'query.pageNum': 1,
      goMore: true,
      moreBtn: false,
      noMoreBtn: false
    })
    this.getBarList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    if (this.data.goMore) {
      this.setData({
        moreBtn: true,
        'query.pageNum': that.data.query.pageNum + 1,
        goMore: false
      })
      this.getBarList()
    }
  }
})