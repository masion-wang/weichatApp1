import WxValidate from '../../utils/WxValidate.js'
import arr from '../../utils/region.js'
Page({
  data: {
    form: {
      uid: "",
      name: "",
      idcard: "",
      phone: "",
      address: "",
      isEnterprisesOfPark: "",
      companyName: "",
      roomNumber: "",
      isTouchSickPeople: false,
      isLeaveSHUIZUISHAN: false,
      isSickFamily: false,
      isOutPlan: false,
      isOutsider: false,
      backDate: '',
      source: [],
      vehicle: "",
      toDoWhat: "",
      healthStatus: [{
          value: "normal",
          text: "健康",
          checked: true
        },
        {
          value: "fever",
          text: "发烧",
          checked: false
        },
        {
          value: "other",
          text: "其它症状",
          checked: false
        }
      ],
      healthStatusTxt: "",
      promise: false
    },
    uidOfsaoysao: "", // 来自扫一扫获取的uid
    read: false, // 是否已阅读
  },
  userService: function() {
    wx.navigateTo({
      url: '../userService/userService',
    })
  },
  privacyPolicy: function() {
    wx.navigateTo({
      url: '../privacyPolicy/privacyPolicy',
    })
  },
  // 一开始加载
  onLoad: function(options) {
    // 是否来自管理员的扫一扫？
    console.log(options)
    if (options.form === 'sanyisao') {
      this.setData({
        uidOfsaoysao: options.uid
      })
      console.log("扫一扫进入登记页面保存uid", this.data.uidOfsaoysao)

    }

    // 1.获取用户id
    const uid = options.uid
    console.log("用户id位", uid)
    this.setData({
      'form.uid': uid
    })
    console.log(this.data.form)

    // 2.表单验证
    this.initValidate();
  },

  // 走后台或者缓存
  onShow: function(res) {
    let that = this
    // 1.走后台不走缓存
    if (that.data.uidOfsaoysao) {
      console.log("走后台渲染")
      var uid = that.data.uidOfsaoysao
      wx.request({
        url: `https://qyweixin.appcan.cn/wx/user/info/${uid}`,
        method: "GET",
        success: function(res) {
          console.log("用户信息为", res)
          if (res.data.code = "000000") {
            // 渲染数据
            that.setData({
              'form.name': res.data.content.name,
              'form.idcard': res.data.content.idcard,
              'form.phone': res.data.content.phone,
              'form.address': res.data.content.address,
              'form.companyName': res.data.content.companyName,
              'form.source': res.data.content.source,
              'form.isEnterprisesOfPark': res.data.content.isEnterprisesOfPark,
              'form.roomNumber': res.data.content.roomNumber,
              'form.isTouchSickPeople': res.data.content.isTouchSickPeople,
              'form.isLeaveSHUIZUISHAN': res.data.content.isLeaveSHUIZUISHAN,
              'form.isSickFamily': res.data.content.isSickFamily,
              'form.isOutPlan': res.data.content.isOutPlan,
              'form.isOutsider': res.data.content.isOutsider,
              'form.vehicle': res.data.content.vehicle,
              'form.backDate': res.data.content.backDate,
              'form.toDoWhat': res.data.content.toDoWhat,
              'form.healthStatusTxt': res.data.content.healthStatusTxt
            })
            // 单选框处理 改数组对象的 checked属性
            var arr = that.data.form.healthStatus
            console.log(arr)
            for (let item of arr) {
              item.checked = false
              if (res.data.content.healthStatus === item.value) {
                item.checked = true
              }
            }
            that.setData({
              'form.healthStatus': arr
            })
            console.log(res.data.content.healthStatus, arr)
          } else {
            console.log("管理员扫一扫过来的查询信息接口有误")
          }
        }
      })
    } else {
      // 2.走缓存
      console.log("走缓存渲染")
      // 获取缓存数据
      let data = wx.getStorageSync('userInfo')
      console.log(data)
      // 如果有缓存
      if (data) {
        this.setData({
          form: data
        })
      }
    }
  },

  // 缓存数据
  onUnload: function() {
    // 缓存用户信息
    let res = wx.setStorageSync('userInfo', this.data.form)
    console.log(res)
  },

  // input中途数据保存
  bindInput: function(e) {
    // 获取当前input的id
    let id = e.currentTarget.id;
    // 获取当前input的值
    let value = e.detail.value
    console.log(id, value)
    console.log(this.data.form)
    // 更改数据 不需要视图改变
    this.data.form[id] = value
    console.log(this.data.form)
  },

  // 提交
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    const params = e.detail.value
    console.log(this.data.form.uid)
    params.uid = this.data.form.uid
    // 把uid保存到params里面
    console.log('params', params)

    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    // 姓名只能输入中文
    let name = this.data.form.name;
    var reg2 = /^[\u4E00-\u9FA5]{2,4}$/; //Unicode编码中的汉字范围
    if (!reg2.test(name)) {
      wx.showToast({
        title: '姓名请输入中文', // 标题
        icon: 'none', // 图标类型，默认success
        duration: 1500 // 提示窗停留时间，默认1500ms
      })
      return false
    }

    // 是否承诺
    if (!params.promise) {
      wx.showToast({
        title: '请点击承诺按钮', // 标题
        icon: 'none', // 图标类型，默认success
        duration: 1500 // 提示窗停留时间，默认1500ms
      })
      return false
    }

    // 是否阅读

    if (!this.data.read) {
      wx.showToast({
        title: '请点击已阅读', // 标题
        icon: 'none', // 图标类型，默认success
        duration: 1500 // 提示窗停留时间，默认1500ms
      })
      return false
    }
    // 不传递已阅读数据
    delete params.read
    let that = this
    // 把该用户id的数据上传到服务器
    wx.request({
      url: 'https://qyweixin.appcan.cn/wx/user/save',
      method: 'POST',
      data: params,
      success: function(res) {
        console.log(res)
        if (res.data.code === '000000') {
          // 清空缓存
          wx.clearStorageSync()
          // 跳转回首页adminOrUser
          wx.redirectTo({
            url: `../adminOrUser/adminOrUser?uid=${res.data.content.uid}`,
          })
        } else {
          // that.showModal({
          //   msg: '提交失败'
          // })
        }
      },
      fail: function(res) {
        // that.showModal({
        //   msg: '提交失败'
        // })
      }
    })
  },

  // 监听是否园区企业开关事件 清除数据
  switchChange1: function(event) {
    console.log(event.detail.value)
    this.setData({
      'form.isEnterprisesOfPark': event.detail.value,
      'form.roomNumber': ""
    })
  },

  // 监听是否外地返回人员开关事件 清除数据
  switchChange2: function(event) {
    // 如果是
    if (event.detail.value) {
      this.setData({
        'form.isOutsider': event.detail.value,
        'form.backDate': '',
        'form.source': arr,
        'form.vehicle': '',
        'form.toDoWhat': '',
      })
    } else { // 如果不是
      this.setData({
        'form.isOutsider': event.detail.value,
        'form.backDate': '',
        'form.source': [],
        'form.vehicle': '',
        'form.toDoWhat': '',
      })
    }
    console.log("地区来源", this.data.form.source)
  },

  // 监听时间选择
  bindDateChange3: function(event) {
    console.log(event.detail.value)
    this.setData({
      'form.backDate': event.detail.value,
    })
  },

  // 监听地区选择
  bindDateChange4: function(event) {
    console.log(event.detail.value)
    this.setData({
      'form.source': event.detail.value
    })
  },

  // 阅读更新
  read: function(event) {
    console.log(event.detail.value)
    this.setData({
      read: event.detail.value
    })
    console.log(this.data.read)
  },

  // 报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },

  // 验证函数
  initValidate() {
    const rules = {
      name: {
        required: true,
        minlength: 2
      },

      idcard: {
        required: true,
        idcard: true,
      },
      phone: {
        required: true,
        tel: true
      },
      address: {
        required: true,
      },
      companyName: {
        required: true,
      }
    }
    const messages = {
      name: {
        required: '请填写姓名',
        minlength: '请输入正确的名称'
      },

      idcard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },
      phone: {
        required: '请填写手机号',
        tel: '请填写正确的手机号'
      },
      address: {
        required: '请输入现地址详细到门牌号',
      },
      companyName: {
        required: '请输入公司名字',
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

})