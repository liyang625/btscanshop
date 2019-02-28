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
    vipcode:""
  },
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
  },
  onLoad: function () {//页面加载结束执行方法
    this.queryData();
  },
  //初始化数据
  initData:function(){
     
  },
  //查询服务器时间
  queryData:function(){
      var that = this;
      if(wx.showLoading){
    	  wx.showLoading({title:"努力加载中"});
      }
      wx.request({
          url: app.getUrl("xlApplyDealBarcode"),
          data: app.getData({}),
          header: app.getHeader(),
          success: function(res) {
        	  if(wx.hideLoading){
        		  wx.hideLoading();
          	}
              if(res.data.Error==0){
                  wxbarcode.barcode('barcode', res.data.data.barCode, 610, 200);
                  wxbarcode.qrcode('ewm', res.data.data.barCode, 510, 510);
                  that.setData({vipcode:res.data.data.barCode});
              }
          }
      })
  },
  //绑定事件 - 刷新
  bindRefuse:function(){
    this.queryData();
  },
})

