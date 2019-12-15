
const app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    qrcode: {
      type: Array,
      value: []
    }
  },
  /** 
   * 私有数据,组件的初始数据 
   * 可用于模版渲染 
   */
  data: { 
    baseUrl: "",
    current: 0,
    duration: 500,
  },
  ready() {
    this.setData({ baseUrl: app.globalData.baseImgUrl })
  },
  /**
   * 组件的方法列表 
   */
  methods: {
    changeIndicatorDots(e){
      console.log(e)
      const detail = e.detail;
      if (detail.source === "touch") {
        this.setData({ current: detail.current })
      }
    },
    closeDialog(){
      this.triggerEvent("closeCode", {})
    }
  }
})