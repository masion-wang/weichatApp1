Page({
  data: {
    form: {
      info: ""
    }
  },
  onLoad: function(options) {},
  formSubmit: function(e) {
    let that = this
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    let info = e.detail.value.info
    console.log(info);
    wx.request({
      url: `https://qyweixin.appcan.cn/wx/user/info/${info}`,
      success: function(res) {
        console.log(res)
        if (res.data.code == "000000") {
          // 获取用户uid
          let result = res.data.content.uid
          // 带着uid跳转到scan页面
          // 跳转scan页面带着id
          wx.navigateTo({
            url: `../scan/scan?key=${result}`,
          })
        }
        else{
          wx.showToast({
            title: '该用户不存在',
            icon:'none'
          })
        }
      }
    })
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
})