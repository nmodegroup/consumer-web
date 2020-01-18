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
    list: {
      type: Array,
      value: []
    },
    type: {
      type: String,
      value: ""
    }
  },
  data: {
    selectIndex: -1
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
    tapSelect(e) {
      const dataset = e.currentTarget.dataset;
      const { index, type } = dataset;
      this.setData({ selectIndex: index })
      this.triggerEvent(
        "onSelect", 
        { type, label: this.data.type }
      );
    }
  }
})