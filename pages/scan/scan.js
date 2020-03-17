// pages/scan/scan.js
Page({
  data: {
    uid: "",
    name: "",
    phone: "",
    idcard: "",
    isEnterprisesOfPark: null,
    companyName: "",
    qrcode_txt: "",
    test_time: "",
    temperature:null
  },
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    // 获取到用户id
    console.log("扫描到的用户id", options.key)
    let uid = options.key
    this.setData({
      uid: options.key
    })
    // 根据id获取相关信息
    wx.request({
      url: `https://qyweixin.appcan.cn/wx/user/info/${uid}`,
      method: "GET",
      success: function(res) {
        console.log("扫描到的这个用户信息", res)
        if (res.data.code == "000000") {
          that.setData({
            name: res.data.content.name,
            phone: res.data.content.phone,
            idcard: res.data.content.idcard,
            isEnterprisesOfPark: res.data.content.isEnterprisesOfPark,
            companyName: res.data.content.companyName,
            qrcode_txt: res.data.content.qrcode_txt,
            test_time: res.data.content.test_time,
            temperature: res.data.content.temperature
          })
          wx.hideLoading()
        }else{
          console.log("管理员扫一扫进入输入体温的接口错误")
        }
      }
    })
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value.input)
    let uid = this.data.uid
    let value = e.detail.value.input
    const params = {
      uid:uid,
      fever: false,
      cough: false,
      weak: false,
      dyspnea: false,
      temperature: value
    }
    // 提交体温数据
    wx.request({
      url: 'https://qyweixin.appcan.cn/wx/user/rep/save',
      method:"POST",
      data: params,
      success:function(res){
        console.log(res)
        if (res.data.code == "000000"){
          wx.showToast({
            title: '体温提交成功',
            icon: 'success',
            duration: 500,
            mask: true
          })
          // 返回上一页
          setTimeout(()=>{
            wx.navigateBack({
              delta:1
            })
          },500)
        }else{
          console.log("上传体温接口失败")
          wx.showToast({
            title: '请输入体温',
            icon: 'none',
            duration: 500,
            mask: true
          })
        }
      }
    })
  },
  changeInfo: function() {
    let uid = this.data.uid
    wx.navigateTo({
      url: `../register/register?uid=${uid}&&form=sanyisao`,
    })
  }
})