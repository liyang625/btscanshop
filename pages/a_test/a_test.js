//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
var wxbarcode = require('../../utils/codemain.js');

var page = Page({
  /**分享 */
  onShareAppMessage: function () {
    return {
      title: '兴隆大院+',
      desc: '你想要的都在这里!',
      path: '/pages/a_my/a_my'
    }
  },
  data: {
      dataList:[
          {
            title: "小程序主要更新(1.0.10)",
            date: "2017年06月22日",
            index: 2
          },
          {
              title:"小程序主要更新(1.0.09)",
              date:"2017年06月01日",
              index:1
          }
      ]
  },
  //查询数据
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onLoad: function () {//页面加载结束执行方法
    
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  }
  
})

