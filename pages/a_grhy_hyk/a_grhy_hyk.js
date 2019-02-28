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
    vipcode:"",//
    time:"",
    timeStr:"",
    point:"",//可用积分：
    finish:false
  },
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
  },
  onLoad: function () {//页面加载结束执行方法
      //wxbarcode.barcode('barcode', 'abc1234134', 680, 200);
      this.initData();
      this.queryServertime();
      this.queryData();
  },
  onUnload:function(){
    console.log("sdfsdfasdfasdfasdfasdfasd");
    this.setData({finish:true});
  },
  //初始化数据
  initData:function(){
      var appUserInfo = app.getAppUserInfo();
      this.setData({vipcode:appUserInfo.vipcode});
      wxbarcode.barcode('barcode', appUserInfo.vipcode, 400, 200);
      //wxbarcode.barcode('barcode', "6300001515454", 400, 200);
      
      var Gid = appUserInfo.gid;// 394:水晶       393:珍珠    397:黄金  395：钻石   396：翡翠
      console.log(appUserInfo);
      if (Gid==394) {// 水晶
          this.setData({card:"../../images/membercenter_card3.png"});
      } else if (Gid==393) {// 珍珠
          this.setData({card:"../../images/membercenter_card1.png"});
      } else if (Gid==397) {// 黄金
          this.setData({card:"../../images/membercenter_card4.png"});
      } else if (Gid==395) {// 钻石
          this.setData({card:"../../images/membercenter_card5.png"});
      } else if (Gid==396) {// 翡翠
          this.setData({card:"../../images/membercenter_card2.png"});
      }else{
          this.setData({card:"../../images/membercenter_card3.png"});
      }
  },
  //查询服务器时间
  queryServertime:function(){
      var that = this;
      wx.request({
          url: app.getUrl("getServertime"),
          data: app.getData({}),
          header: app.getHeader(),
          success: function(res) {
              if(res.data.Error==0){
                  that.setData({time:res.data.servertime});
                  that.startTime();
              }
          }
      })
  },
  //查询数据
  queryData:function(){
      var that = this;
      wx.request({
          url: app.getUrl("fetchPoint"),
          data: app.getData({}),
          header: app.getHeader(),
          success: function(res) {
              if(res.data.Error==0){
                  var point = res.data.data.integral.AmtPoint + res.data.data.integral.OnlineAmtPoint;
                  that.setData({point:"可用积分："+point+"分"});
              }
          }
      })
  },
  //时间走动
  startTime:function(){
      var time = this.data.time;
      var date = new Date(time);
      this.setData({time:(time+1000),timeStr:app.formatTime(date,"yyyy-MM-dd hh:mm:ss")});
      if (!this.data.finish){
        setTimeout(this.startTime, 1000);
      }
  },
  viewFunc:function(){
      //wx.navigateTo({url:'/pages/a_grhy_hyk_sm/a_grhy_hyk_sm'});
  },
  //绑定函数 - 条形码放大
  bindfunEnlarge:function(){
    if(this.data.vipcode==""){
        return;
    }
    wx.navigateTo({url:'/pages/a_grhy_hyk_enlarge/a_grhy_hyk_enlarge?vipcode='+this.data.vipcode});
  }
})

