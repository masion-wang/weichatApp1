Page({
  data: {
    form: {
      uid: "",
      isFever: false,
      cough: false,
      weak: false,
      dyspnea: false,
      temperature: -1
    },
    uid: ""
  },
  onLoad: function(options) {
    // 获取用户id
    console.log("每日打卡", options.uid)
    this.setData({
      'uid': options.uid
    })

  },
  // 提交按钮
  formSubmit: function(e) {
    let that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let uid = this.data.uid
    this.setData({
      'form': e.detail.value,
      'form.uid': uid,
      'form.temperature': -1
    })
    let params = this.data.form
    console.log("用户当日状态", params)
    // 上传当日健康状态
    wx.request({
      url: 'https://qyweixin.appcan.cn/wx/user/rep/save',
      method: "POST",
      data: params,
      success: function(res) {
        console.log(res)
        if (res.data.code == "000000") {
          wx.showToast({
            title: '上传成功！', // 标题
            icon: 'success', // 图标类型，默认success
            duration: 1000 // 提示窗停留时间，默认1500ms
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else if (res.data.code == "300003") {
          wx.showToast({
            title: '本日已打卡 请勿重复打卡', // 标题
            icon: 'none', // 图标类型，默认success
            duration: 1000 // 提示窗停留时间，默认1500ms
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
          // 成功打卡 返回已经打卡参数
          // navigateBack 传参数
          // var pages = getCurrentPages();
          // var prevPage = pages[pages.length - 2]; //上一个页面
          // //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          // prevPage.setData({
          //   mydata: {
          //     a: 1,
          //     b: 2
          //   }
          // })
        } else {
          console.log('用户每日上传健康状态接口失败')
        }
      },
      fail: function(res) {
        console.log('用户每日上传健康状态接口失败', res)
      }
    })
  },
})