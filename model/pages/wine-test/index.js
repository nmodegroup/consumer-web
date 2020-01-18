// model/pages/wine-test/index.js
const wxManager = require('../../../utils/wxManager')
const httpManager = require('../../../lib/request/httpManager');
const WineService = require('../../../service/wine')
const Router = require("../../../router/Router")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: [{
      label: "女生",
      type: 2
    },
    {
      label: "男生",
      type: 1
    }],
    barType: [{
      label: "清吧",
      type: 1
    }, {
        label: "闹吧",
        type: 2
      }],
    expense: [{
      label: "1000以下",
      type: 1
    }, {
        label: "1000以上",
        type: 2
      }, {
        label: "请全场",
        type: 3
      }, {
        label: "我都是被请的",
        type: 4
      }],
    frequency: [{
      label: "什么是酒吧",
      type: 1
    }, {
        label: "偶尔去一下",
        type: 2
      }, {
        label: "一周几次",
        type: 3
      }, {
        label: "我住在酒吧",
        type: 4
      }],
      params: {
        sex: "",
        barType: "",
        expense: "",
        frequency: ""
      }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent("#toast")
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
  submitInfo(){
    const { params } = this.data;
    let errMsg = ""
    if (params.sex === "") {
      errMsg = "请选择性别"
    } else if (params.barType === "") {
      errMsg = "请选择常去的酒吧类型"
    } else if (params.expense === "") {
      errMsg = "请选择消费金额"
    } else if (params.frequency === "") {
      errMsg = "请选择去酒吧频率"
    }
    console.log(params)
    if (errMsg !== "") {
      this.toast.showToast({
        content: errMsg
      })
      return
    }
    this.postDivination()
  },
  onSelect(e){
    const detail = e.detail;
    const { type, label } = detail;
    let { params } = this.data;
    params[label] = type;
    this.setData({ params } )
  },
  postDivination(){
    const { params } = this.data;
    WineService.postDivination(params).then(res => {
     console.log(res)
      wxManager.redirectTo(Router.WineResult, { divination: res })
    }).catch(error => {
      this.toast.showToast({
        content: error.msg
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})