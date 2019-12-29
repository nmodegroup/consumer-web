
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
    codes: {
      type: Array,
      value: []
    },
    tips: {
      type: String,
      value: ""
    }
  },
  /** 
   * 私有数据,组件的初始数据 
   * 可用于模版渲染 
   */
  data: {
  },
  ready() {
  },
  /**
   * 组件的方法列表 
   */
  methods: {
    closeDialog() {
      this.triggerEvent("close", {})
    },
    useCode(){
      this.triggerEvent("usecode", {})
    }
  }
})