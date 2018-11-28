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
    money:"",
    term:"",
    title:""
  },
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
  },
  onLoad: function (options) {//页面加载结束执行方法
    this.func_queryData(options.id);
    return;
    this.setData({
        vipcode:options.ewm,
        money:options.money,
        term:options.term,
        title:options.title
    });

    wxbarcode.barcode('barcode', options.ewm, 610, 200);
    wxbarcode.qrcode('ewm', options.ewm, 510, 510);

  },
  //查询数据
  func_queryData: function (id) {
    var that = this;
    if(wx.showLoading){
    	wx.showLoading({ title: "努力加载中" });
    }
    wx.request({
      url: app.getUrl("coupon_log_details"),
      data: app.getData({coupon_log_id:id}),
      header: app.getHeader(),
      success: function (res) {
    	  if(wx.hideLoading){
    		  wx.hideLoading();
      	}
        that.setData({
          money: res.data.data.do_price,
          term: res.data.data.limit_btimed + "-" + res.data.data.limit_etimed,
          title: res.data.data.title
        });

        wxbarcode.barcode('barcode', res.data.data.ewm, 610, 200);
        wxbarcode.qrcode('ewm', res.data.data.ewm, 510, 510);
      }
    })
  }
})

