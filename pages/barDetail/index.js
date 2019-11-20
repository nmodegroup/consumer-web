const Router = require('../../router/Router');
const BarService = require('../../service/bar');
const settingService = require('../../service/setting');
const WxManager = require('../../utils/wxManager');
const app = getApp();

/**
 * 获取参数
 * @param {string} scene 需要解析的字段
 * @param {string} name 字段 key
 */
function getQueryString(scene, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = scene.match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    interval: 5000,
    duration: 1000,
    baseUrl: '',
    bar: {}, //酒吧详情
    orderList: [], //获取订单信息
    idx: 0, //订单选择日期的下标默认今天的下标
    phoneLayer: false,
    remindForm: {
      remindPhone: '', //设置提醒电话号码
      date: '',//可接受到店时间
      remindNum: ''//预计到店人数
    },
    selOrder: {}, //选中的订单
    visiblePicker: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
    // 处理二维码跳转
    if (options.scene) {
      const scene = decodeURIComponent(options.scene);
      const mid = getQueryString(scene, 'mid');
      return this.requestBarInfo(mid);
    }
    this.requestBarInfo(options.id);
  },

  initData() {
    this.setData({
      baseUrl: app.globalData.baseImgUrl
    });
    this.toast = this.selectComponent('#toast')
    this.modal = this.selectComponent('#modal')
  },

  requestBarInfo(barId) {
    this.getBarDetail(barId);
    this.getBarOrder(barId);
  },

  //跳转酒店预订页面
  onBooking: function(e) {
    let item = e.currentTarget.dataset.item;
    if (app.globalData.online) {
      //如果以登录
      if (!app.globalData.phone) {
        //判断登录接口有没有返回手机号 没有返回获取手机号授权
        this.setData({
          phoneLayer: true
        });
      } else {
        this.inBooking(item);
      }
    } else {
      this.inBooking(item);
    }
  },
  //调用接口
  inBooking: function(item) {
    this.setData({
      selOrder: item
    });
    if (item.appointType == 0) {
      let name = this.data.bar.name.replace(/\&/g, "@")
      WxManager.navigateTo(Router.Booking, { id: this.data.bar.id, name: name});
    } else if (item.appointType == 1) {
      this.setData({
        remindLayer: true
      });
    } else if (item.appointType == 2) {
      this.modal.showModal({
        content: '确定要取消提醒吗？\n取消后将无法获取空位提醒哦~',
        title: '温馨提示',
        cancelText: '再看看',
        confirmText: '确认取消'
      });
    } else if (item.appointType == 3) {
      this.modal.showModal({
        content: '确定要取消预订吗？\n取消后可能导致没有桌位了哦~',
        title: '温馨提示',
        cancelText: '再看看',
        confirmText: '确认取消'
      });
    }
  },
  //获取酒吧信息
  getBarDetail: function(id) {
    BarService.getBarDetail({ id: id })
      .then(res => {
        this.setData({
          bar: res
        });
      })
      .catch(error => {
        this.toast.showToast({
          content: error.msg
        })
      });
  },
  //获取酒吧预订信息
  getBarOrder: function(id) {
    let barId = id || this.data.bar.id;
    BarService.getBarOrder({ id: barId })
      .then(res => {
        this.setData({
          orderList: res
        });
      })
      .catch(error => {
        this.toast.showToast({
          content: error.msg
        })
      });
  },
  //拨打电话
  onCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    });
  },
  //开始导航
  onOpenLocation: function() {
    wx.openLocation({
      latitude: this.data.bar.lat - 0,
      longitude: this.data.bar.lng - 0,
      address: this.data.bar.address
    });
  },
  //收藏取消收藏
  onCollect: function() {
    let id = this.data.bar.id;
    if (this.data.bar.isCollect == 1) {
      BarService.cancelCollect({ id: id })
        .then(res => {
          this.getBarDetail(id);
          this.toast.showToast({
            content: '已取消收藏',
            icon: 'success'
          });
        })
        .catch(error => {
          this.toast.showToast({
            content: error.msg
          })
        });
    } else if (this.data.bar.isCollect === 0) {
      BarService.setCollect({ id: id })
        .then(res => {
          this.getBarDetail(id);
          this.toast.showToast({
            content: '收藏成功',
            icon: 'success'
          });
        })
        .catch(error => {
          this.toast.showToast({
            content: error.msg
          })
        });
    }
  },
  //选择日期
  onSelDate: function(e) {
    this.setData({
      idx: e.currentTarget.dataset.idx
    });
  },
  //获取手机号授权弹框取消按钮
  phoneCancel: function() {
    this.setData({
      phoneLayer: false
    });
  },
  //获取手机号
  getPhoneNumber: function(e) {
    this.setData({
      phoneLayer: false
    });
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      wx.login({
        success: res => {
          let form = {
            code: res.code,
            encrypted: e.detail.encryptedData,
            iv: e.detail.iv
          };
          settingService
            .setPhone(form)
            .then(res => {
              app.globalData.phone = res;
            })
            .catch(error => {
              this.toast.showToast({
                content: error.msg
              })
            });
        },
        fail: res => {
          console.log('login err:', res);
        }
      });
    }
  },
  //监听手机号输入
  onInput: function(e) {
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
  //监听选择时间
  onTimeInput (e) {
    this.setData({
      'remindForm.date': e.detail
    })
  },

  //设置提醒取消
  remindCancel: function() {
    this.setData({
      remindLayer: false,
      'remindForm.remindPhone': '',
      'remindForm.date': '',
      'remindNum': ''
    });
  },
  //设置提醒确认
  remindConfirm: function(item) {
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
      let date = this.data.selOrder.businessDate + this.data.remindForm.date
      let form = {
        id: this.data.bar.id,
        date: date,
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
          this.getBarOrder();
        })
        .catch(error => {
          this.toast.showToast({
            content: error.msg
          })
        });
    }
  },
  //取消提醒
  cancelRemind: function() {
    BarService.cancelRemind({ id: this.data.selOrder.id })
      .then(res => {
        this.toast.showToast({
          content: '取消提醒成功',
          icon: 'success'
        });
        this.getBarOrder();
      })
      .catch(error => {
        this.toast.showToast({
          content: error.msg
        })
      });
  },
  //酒吧预订取消
  cancelBarOrder: function() {
    BarService.cancelBarOrder({ id: this.data.selOrder.id })
      .then(res => {
        this.toast.showToast({
          content: '取消预订成功',
          icon: 'success'
        });
        this.getBarOrder();
      })
      .catch(error => {
        this.toast.showToast({
          content: error.msg
        })
      });
  },
  //modal弹框回调
  getResult: function(e) {
    if (e.detail.result == 'confirm') {
      if (this.data.selOrder.appointType == 2) {
        this.cancelRemind();
      } else if (this.data.selOrder.appointType == 3) {
        this.cancelBarOrder();
      }
    }
  },
  //选择提醒时间
  onSelTime () {
    this.setData({
      visiblePicker: true
    })
  },
  //选择提醒时间弹框取消
  handleCancel () {
    this.setData({
      visiblePicker: false
    })
  },
  //选择提醒时间弹框确认
  handleConfirm () {
    this.setData({
      visiblePicker: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getBarOrder()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return {
      title: this.data.bar.name,
      path: 'pages/index/index' + '?barId=' + this.data.bar.id
    };
  }
});
