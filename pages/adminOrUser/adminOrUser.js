// pages/adminOrUser/adminOrUser.js
Page({
  data: {
    uid: "",
    isInit: null, // 是否需要首次填写
    isUser: true, // 用户||管理员
    mydata: {} // 判断当日是否打卡
  },
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(111111111111111111111)
    let that = this
    console.log("options", options)
    // 如果有uid 说明用户已经登记完了 获取用户信息
    // if (options.uid) {
    //   wx.request({
    //     url: `https://qyweixin.appcan.cn/wx/user/info/${options.uid}`,
    //     method: "GET",
    //     success: function (res) {
    //       console.log("已经登记过的用户信息", res)
    //       if (res.data.coe = "000000") {
    //         // 更改登记状态 保存当前id
    //         that.setData({
    //           isInit: res.data.content.isInit,
    //           uid: options.uid
    //         })
    //       } else {
    //         console.log("已经登记过的请求用户信息isInit uid的接口错误")
    //       }

    //     },
    //     fail: function (res) {
    //       console.log('已经登记过的请求用户信息isInit uid的接口错误')
    //     }
    //   })
    // } else {
    // 获取用户信息
    wx.login({
      success: function(data) {
        console.log("code值：", data.code)
        wx.request({
          url: `https://qyweixin.appcan.cn/wx/login`,
          method: "post",
          data: {
            code: data.code
          },
          success: function(res) {
            if (res.data.code = "000000") {
              console.log(res)
              // 获取uid
              that.setData({
                uid: res.data.openid
              })
              // 判断有没有登记 
              that.setData({
                isInit: res.data.content.isInit
              })
              console.log("11111222",that.data.isInit)
              // 判断是用户还是管理员
              if (res.data.content.role === 'user') {
                that.setData({
                  isUser: true
                })
              } else {
                that.setData({
                  isUser: false
                })
              }
            } else {
              console.log("通过code获取openid接口失误")
            }
          },
          fail: function(res) {
            console.log('通过code获取openid接口失误', res)
          }
        })
      },
      fail: function(err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
        callback(err)
      }
    })
    // }
  },
  // 已经打卡
  onShow: function() {
    let that = this
    // 获取用户信息
    wx.login({
      success: function(data) {
        console.log("code值：", data.code)
        wx.request({
          url: `https://qyweixin.appcan.cn/wx/login`,
          method: "post",
          data: {
            code: data.code
          },
          success: function(res) {
            if (res.data.code = "000000") {
              console.log(res)
              // 获取uid
              that.setData({
                uid: res.data.openid
              })
              // 判断有没有登记 
              that.setData({
                isInit: res.data.content.isInit
              })
              // 判断是用户还是管理员
              if (res.data.content.role === 'user') {
                that.setData({
                  isUser: true
                })
              } else {
                that.setData({
                  isUser: false
                })
              }
              wx.hideLoading()
            } else {
              console.log("通过code获取openid接口失误")
            }
          },
          fail: function(res) {
            console.log('通过code获取openid接口失误', res)
          }
        })
      },
      fail: function(err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
        callback(err)
      }
    })
  },

  // 1.跳转登记页
  jumpToRegister: function() {
    let that = this
    wx.redirectTo({
      url: `../register/register?uid=${that.data.uid}`
    })
  },
  // 2.跳转我的健康码
  jumpToMine: function() {
    // 获取用户uid
    let that = this
    wx.navigateTo({
      url: `../mine/mine?uid=${that.data.uid}`
    })
  },
  // 3.跳转每日健康打卡
  jumpToeveryDay: function() {
    let that = this
    wx.navigateTo({
      url: `../everyDay/everyDay?uid=${that.data.uid}`,
      success: function(res) {

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 4.跳转统计信息
  jumpToInfoStatistics: function() {
    wx.navigateTo({
      url: '../infoStatistics/infoStatistics',
      success: function(res) {

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 5.扫一扫 扫成功了带着参数id跳转到scan页面
  scan: function() {
    var _this = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        console.log("扫一扫结果",res)
        // 扫描成功 获取id
        var result = res.result;
        // 跳转scan页面带着id
        wx.navigateTo({
          url: `../scan/scan?key=${result}`,
        })
      }
    })
  },
  // 6.手动查询
  manual:function(){
    // 跳转scan页面带着id
    wx.navigateTo({
      url: `../manual/manual`,
    })
  }
})