import QRCode from '../../utils/weapp-qrcode.js'

Page({
  data: {
    qrcode_color: "",
    qrcode_txt: "",
    temperature: "",
    test_time: "",
    uid:""
  },
  onLoad: function (options) {
    let that = this
    // 先看看有没有缓存的用户信息id
    var uid = wx.getStorageSync('userUid')
    if (uid) {
      console.log("用非第一次登陆已缓存 用户信息", options, "用户ID", uid)
      that.setData({
        
      })
    } else {
      // 获取用户信息id
      // 获取用户id做个缓存
      var uid = options.uid
      wx.setStorageSync('userUid', uid)
      console.log("第一次获取用户id",uid)
    }

    // 生成二维码
    new QRCode('myQrcode', {
      text: uid,
      width: 200,
      height: 200,
      padding: 10, // 生成二维码四周自动留边宽度，不传入默认为0
      colorDark: "#1CA4FC",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        console.log(res.path)
      }
    })
    // 获取用户健康状态
    wx.request({
      url: `https://qyweixin.appcan.cn/wx/user/info/${uid}`,
      method: "GET",
      success: function (res) {
        if (res.data.code == "000000") {
          that.setData({
            qrcode_color: res.data.content.qrcode_color,
            qrcode_txt: res.data.content.qrcode_txt,
            temperature: res.data.content.temperature,
            test_time: res.data.content.test_time
          })
          console.log("颜色", that.data.qrcode_color)
          console.log("健康状态", that.data.qrcode_txt)
          console.log("上次测量时间", that.data.test_time)
          console.log("上次体温", that.data.temperature)
        } else {
          console.log("用户获取每日健康相关数据接口失败", res)
        }
      },
      fail: function (res) {
        console.log("用户获取每日健康相关数据接口失败", res)
      }
    })
  }
})