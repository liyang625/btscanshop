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
      checkedArray:["checked","",""],
      data:[{}]
  },
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
  },
  onLoad: function () {//页面加载结束执行方法
      this.bindOnline();
  },
  //绑定事件 - 线上
  bindOnline:function(){
    this.setData({checkedArray:["checked","",""]});
    this.func_queryData(1);
  },
  //绑定事件 - 线下
  bindLine:function(){
    this.setData({checkedArray:["","checked",""]});
    this.func_queryData(2);
  },
  //绑定事件 - 储值卡
  bindStoredValueCard:function(){
    this.setData({checkedArray:["","","checked"]});
    this.func_queryData(3);
  },
  //查询数据
  func_queryData:function(type){
    var that = this;
    if(wx.showLoading){
    	wx.showLoading({title:"努力加载中"});
    }
    wx.request({
      url: app.getUrl("MyCoupon"),
      data: app.getData({page:-1,pagesize:10,use:3,type:type}),
      header: app.getHeader(),
      success: function (res) {
    	  if(wx.hideLoading){
    		  wx.hideLoading();
      	}
        //res.data.data[0]["ewm"] = "234234";
        if (res.data.data.length!=0){
          that.setData({ data: res.data.data });
        }else{
          that.setData({ data: [{}]});
        }
        
      }
    })
  },
  //绑定事件 - 二维码
  bindViewEwm:function(res){
    if (this.data.checkedArray[1] !="checked"){
        return;
      }
      var id = res.currentTarget.dataset.id;
      wx.navigateTo({url:'/pages/a_my_card_show/a_my_card_show?id='+id});
  }
})

