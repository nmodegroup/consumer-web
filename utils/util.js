const loginTip = (msg) => {
  wx.showModal({
    title: '提示',
    showCancel: false,
    content: msg,
    confirmColor: '#F85110',
    success: function (res) {

    }
  })
}
const toast = (msg) => {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}
module.exports = {
  loginTip,
  toast
}