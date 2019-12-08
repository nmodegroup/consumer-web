const Router = require("../../router/Router")
const BarService = require('../../service/bar')
const WxManager = require('../../utils/wxManager')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    form: {
      id: '',//酒吧id
      date: '',//酒吧日期
      areaId: '',//桌位区域id
      tableAreaName: '',//桌位区域名称
      tableNum: '',//桌位人数
      appointArriveTimeId: ''//预订单点时间id
    },
    barName: '',//酒吧名称
    selId: '',//选择的桌位id
    selIdx: '',//选择的座位下标
    selDate: '',//选择的日期
    selWeek: '',//选择的week
    selTime: '',//选择的时间
    tableList: [],//桌位列表
    timeList: [],//时间列表
    idx: 0, //订单选择日期的下标默认今天的下标
    remindLayer: false,
    remindForm: {
      remindPhone: '', //设置提醒电话号码
      date: '',//可接受到店时间
      remindNum: ''//预计到店人数
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let name = options.name.replace(/\@/g, "&")
    this.toast = this.selectComponent("#toast")
    this.modal = this.selectComponent("#modal")
    this.getBarOrder(options.id)
    this.setData({
      'form.id': options.id,
      barName: name
    })
    this.getBarTime()
  },
  onToast: function () {
    //图标有 success warn fail wait四种
    this.toast.showToast({
      content: '预订成功',
      icon: 'success'
    })
  },
  //获取酒吧预订信息
  getBarOrder: function (id) {
    BarService.getBarOrder({ id: id }).then(res => {
      this.setData({
        orderList: res
      })
    }).catch(error => {
      this.toast.showToast({
        content: error.msg
      })
    })
  },
  //选择日期
  onSelDate: function (e) {
    if (e.currentTarget.dataset.item.appointType == 0) {
      this.setData({
        tableList: [],
        selIdx: '',
        'form.areaId': ''
      })
      this.setData({
        selDate: e.currentTarget.dataset.item.date,
        selWeek: e.currentTarget.dataset.item.week,
        'form.date': e.currentTarget.dataset.item.businessDate
      })
      this.getBarTable({
        id: this.data.form.id,
        date: e.currentTarget.dataset.item.businessDate
      })
    } else {
      this.toast.showToast({
        content: '不可预约',
        icon: 'warn'
      })
    }
  },
  //获取桌位列表
  getBarTable: function (form) {
    BarService.getBarTable(form).then(res => {
      this.setData({
        tableList: res
      })
    }).catch(error => {
      this.toast.showToast({
        content: error.msg
      })
    })
  },
  //获取到店时间列表
  getBarTime: function () {
    BarService.getBarTime({ id: this.data.form.id }).then(res => {
      this.setData({
        timeList: res
      })
    }).catch(error => {
      this.toast.showToast({
        content: error.msg
      })
    })
  },
  //选择桌位
  onSelTable: function (e) {
    if (!e.currentTarget.dataset.num) {
      this.modal.showModal({
        content: '想订的座位没有空为了？来进入排位吧',
        title: '温馨提示',
        cancelText: '取消',
        confirmText: '进入排位'
      })
    } else {
      this.setData({
        selId: e.currentTarget.dataset.id,
        selIdx: e.currentTarget.dataset.idx,
        'form.tableNum': e.currentTarget.dataset.tablenum,
        'form.tableAreaName': e.currentTarget.dataset.name,
        'form.areaId': e.currentTarget.dataset.id
      })
    }
  },
  //弹框回调
  getResult: function (e) {
    if (e.detail.result == 'confirm') {
      this.setData({
        remindLayer: true
      })
    }
  },

  //选择提醒时间
  onSelRemindTime() {
    this.setData({
      visiblePicker: true
    })
  },
  //选择提醒时间弹框取消
  handleCancel() {
    this.setData({
      visiblePicker: false
    })
  },
  //选择提醒时间弹框确认
  handleConfirm(e) {
    this.setData({
      visiblePicker: false,
      'remindForm.date': e.detail
    })
  },
  //监听手机号输入
  onInput: function (e) {
    this.setData({
      'remindForm.remindPhone': e.detail.value
    });
  },
  //监听设置提醒预计人数
  onNumInput: function (e) {
    this.setData({
      'remindForm.remindNum': e.detail.value
    });
  },

  //设置提醒取消
  remindCancel: function () {
    this.setData({
      remindLayer: false,
      'remindForm.remindPhone': '',
      'remindForm.date': '',
      'remindNum': ''
    });
  },
  //设置提醒确认
  remindConfirm: function (item) {
    let rmobile = /^1(3|4|5|7|8|6|9)\d{9}$/;
    if (!rmobile.test(this.data.remindForm.remindPhone)) {
      this.toast.showToast({
        content: '请输入正确的设置提醒手机号',
        icon: 'warn'
      });
    } else if (!this.data.remindForm.remindNum) {
      this.toast.showToast({
        content: '请输入到店人数',
        icon: 'warn'
      });
    } else if (!this.data.remindForm.date) {
      this.toast.showToast({
        content: '请选择到店时间',
        icon: 'warn'
      });
    } else {
      let date = `${this.data.form.date} ${this.data.remindForm.date}`
      let form = {
        id: this.data.form.id,
        date: date,
        remindNum: this.data.remindForm.remindNum,
        remindPhone: this.data.remindForm.remindPhone
      };
      BarService.setRemind(form)
        .then(res => {
          this.toast.showToast({
            content: '空位提醒设置成功',
            icon: 'success'
          });
          this.setData({
            remindLayer: false
          });
          setTimeout(() => {
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]; //上一个页面
            prevPage.getBarOrder()
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        })
        .catch(error => {
          this.toast.showToast({
            content: error.msg
          })
        });
    }
  },
  //选择时间
  onSelTime: function (e) {
    this.setData({
      'form.appointArriveTimeId': e.currentTarget.dataset.id,
      selTime: e.currentTarget.dataset.time
    })
  },
  //预定
  onBooking: function () {
    if (!this.data.form.date) {
      this.toast.showToast({
        content: '请选择日期',
        icon: 'warn'
      })
    } else if (!this.data.form.areaId){
      this.toast.showToast({
        content: '请选择桌位',
        icon: 'warn'
      })
    } else if (!this.data.form.appointArriveTimeId) {
      this.toast.showToast({
        content: '请选择到店时间 ',
        icon: 'warn'
      })
    } else {
      BarService.bookBarOrder(this.data.form).then(res => {
        if (res.autoReceipt) {
          this.toast.showToast({
            content: '您已成功预定桌位',
            icon: 'success'
          })
        } else {
          this.toast.showToast({
            content: '您预订的桌位需要商家确认\n请耐心等待',
            icon: 'wait'
          })
        }
        setTimeout(() => {
          let pages = getCurrentPages()
          let prevPage = pages[pages.length - 2]; //上一个页面
          prevPage.getBarOrder()
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      }).catch(error => {
        this.toast.showToast({
          content: error.msg
        })
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