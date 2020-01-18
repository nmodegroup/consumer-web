const app = getApp()
Component({
  options: {
    multipleSlots: true
  },
  behaviors: [],
  properties: {
    title: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'show' // show , confirm
    },
    show: {
      type: Boolean,
      value: false
    }
  },

  data: {
    showDialog: true
  }, 

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () { },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
    hide: function () { },
    resize: function () { },
  },

  methods: {
    close(){
      app.globalData.divinationShow = false;
      this.setData({ showDialog: false })
    },
    maskLayer(){
      this.setData({ showDialog: false })
    }
  }
})