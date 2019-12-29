Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    show: false,
    content: '网络开小差了',
    // 多行提示时，因为单个view换行文字不居中
    extraContent: '',
    iconImg: '', //图标
    icon: {
      success: '/image/icon_succed.svg',
      fail: '/image/icon_fail.svg',
      warn: '/image/icon_warn.svg',
      wait: '/image/icon_wait.svg'
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 显示toast，定义动画
     */
    showToast({ content, multContent, icon }) {
      let iconImg = icon ? this.data.icon[icon] : '';
      this.setData({
        show: true,
        content: content,
        multContent: multContent || '',
        iconImg: iconImg
      });
      /**
       * 延时消失
       */
      setTimeout(
        function () {
          this.setData({
            show: false
          });
        }.bind(this),
        1500
      );
    }
  }
});
