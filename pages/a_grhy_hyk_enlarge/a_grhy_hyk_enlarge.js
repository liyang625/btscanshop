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
    card:"",//卡图片路径
    vipcode:"0",//
    time:"",
    timeStr:"",
    point:""//可用积分：
  },
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad(); 
    wx.stopPullDownRefresh();
  },
  onLoad: function (options) {//页面加载结束执行方法
      this.setData({vipcode:options.vipcode});
      wxbarcode.barcode('barcode', options.vipcode, 750, 200);
  }
})

