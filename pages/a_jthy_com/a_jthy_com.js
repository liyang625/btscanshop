//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')

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
    nextType:-1,//下一条转页面类型，0：注册
    com:1,
    userInfo: {}//用户信息        
  },
   clickButton: function() {
      wx.switchTab({url:'/pages/a_jthy/a_jthy'});
  },
onLoad: function (query) {
    this.setData({
      com:query.com
    });
  },
  initPage:function(){
      this.setData({showMain:"block",showRegist:"none"});
      //this.queryNav();
  },
 onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})

