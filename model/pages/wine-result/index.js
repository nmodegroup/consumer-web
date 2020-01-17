// model/pages/wine-result/index.js
const wxManager = require('../../../utils/wxManager')
const httpManager = require('../../../lib/request/httpManager');
// const ActivityService = require('../../../service/activity')
// const Router = require("../../../router/Router")
const CONSTANT = require("../../../lib/request/constant")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.modal = this.selectComponent("#modal")
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
  saveImage(){
    this.startDraw();
  },
  startDraw() {
    Promise.all([this.queryCanvasRect()])
      .then(result => {
        console.log(result)
        this.drawCanvas(result);
      })
      .catch((err) => {
        console.error(err)
        wx.showToast({
          title: "保存失败，请重试",
          icon: 'none',
          duration: 3000
        })
      });
  },
  /**
   * 得到 canvas 的宽高
   */
  queryCanvasRect() {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery();
      //选择id
      query
        .select('.canvas')
        .boundingClientRect(rect => {
          this.setData({
            canvasHeight: rect.height,
            canvasWidth: rect.width
          });
          resolve(rect);
        })
        .exec();
    });
  },
  downloadCodeImage() {
    return new Promise((resolve, reject) => {
      const { codeImageUrl } = this.data;
      const params = {
        url: codeImageUrl
      };
      PageHelper.requestWrapper(httpManager.download(params))
        .then(res => {
          resolve(res.tempFilePath);
        })
        .catch(err => {
          wx.showToast({
            title: "保存失败，请重试",
            icon: 'none',
            duration: 3000
          })
        });
    });
  },
  drawCanvas(result) {
    wxManager.showLoading();
    const rect = result[0];
    // code 图片路径
    // const codeImagePath = result[1];
    // canvas 宽高
    const { height, width } = rect;
    // 背景色
    const NU_COLOR = '#15153E';
    const WHITE_COLOR = '#FFFFFF';
    // code 半径
    const codeRadius = 37.5;

    // canvas 上下文
    const ctx = wx.createCanvasContext('myCanvas', this);
    ctx.setFillStyle(NU_COLOR);
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage('/model/image/pic_poster_save.png', 0, 0, width, height);

    // 绘制文字
    ctx.setFontSize(40);
    ctx.fillText("我是大神", 48, 608);
    ctx.setFillStyle("#fff");
    //
    ctx.drawImage('/model/image/pic_word_kuang.png', 48, 658, 608, 246);

    // 二维码背景圆，圆的原点x坐标，y坐标，半径，起始弧度，终止弧度
    const arcRadius = 44;
    ctx.arc(0.5 * width, 368, arcRadius, 0, 2 * Math.PI);
    ctx.setFillStyle(WHITE_COLOR);
    ctx.fill();

    // 绘制二维码，图片路径，左上角x坐标，左上角y坐标，宽，高
    // ctx.drawImage(codeImagePath, 112, 330, 2 * codeRadius, 2 * codeRadius);
    ctx.restore();

    //绘制到 canvas 上
    ctx.draw(false, () => {
      this.saveCanvasImage();
    });
  },
  /**
     * canvas 转 image
     */
  saveCanvasImage() {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: res => {
        this.setData({
          shareImageUrl: res.tempFilePath
        });
        this.saveToAlbum(res.tempFilePath);
      },
      complete: () => {
        wxManager.hideLoading();
      }
    });
  },

  saveToAlbum(imageSource) {
    wxManager
      .saveImageToPhotosAlbum(imageSource)
      .then(() => {
        // PageHelper.showSuccessToast('保存成功');
      })
      .catch(() => {
        // PageHelper.showSaveAlbumModal().then(() => {
        //   this.saveToAlbum(imageSource);
        // });
      });
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