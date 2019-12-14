Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  /** 
   * 私有数据,组件的初始数据 
   * 可用于模版渲染 
   */
  data: { 
    qrcode: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    current: 0,
    duration: 500
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
    }
  }
})