Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/index/index",
      iconPath: "/image/icon_tab_home.png",
      selectedIconPath: "/image/icon_tab_home_HL.png"
    }, {
      pagePath: "/index/activity",
      iconPath: "/image/icon_tab_activity.png",
      selectedIconPath: "/image/icon_tab_activity_HL.png"
      }, {
        pagePath: "/index/mine",
        iconPath: "/image/icon_tab_mine.png",
        selectedIconPath: "/image/icon_tab_mine_HL.png"
      }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})