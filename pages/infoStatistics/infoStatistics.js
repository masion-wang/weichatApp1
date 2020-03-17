// pages/infoStatistics/infoStatistics.js
Page({
  data: {
    search: {
      startTime: "",
      endTime: "",
      healthStatus: [{
        value: "green",
        text: "健康",
        checked: true
      },
      {
        value: "yellow",
        text: "发烧"
      },
      {
        value: "red",
        text: "危险"
      }
      ],
      isLocal: false
    },
    num_user: 0,
    num_in: 0
  },
  onLoad: function (options) {

  },
  // 查询
  formSubmit: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const params = e.detail.value
    // 时间必须穿
    if ((params.startTime != "") && (params.endTime != "")) {
    } else {
      wx.showToast({
        title: '请输入查询时间',
        icon: 'none',
        duration: 500,
        mask: true
      })
      return false
    }
    wx.request({
      url: 'https://qyweixin.appcan.cn/wx/user/rep/list',
      method: "POST",
      data: params,
      success: function (res) {
        console.log("获取统计信息", res)
        if (res.data.code == "000000") {
          wx.showToast({
            title: '查询成功',
            icon: 'success',
            duration: 300,
            mask: true
          })
          that.setData({
            num_user: res.data.content.num_user,
            num_in: res.data.content.num_in,
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: '查询失败',
            icon: 'none',
            duration: 300,
            mask: true
          })
        }
      }
    })
  },

  startTime: function (e) {
    console.log(e.detail.value)
    this.setData({
      'search.startTime': e.detail.value
    })
  },
  endTime: function (e) {
    console.log(e.detail.value)
    this.setData({
      'search.endTime': e.detail.value
    })
  },

})