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
      nextType:-1,//下一条转页面类型，0：注册
      headurl:"../../images/my_mrtx.png",
      username:"",
      card:"",
      showMain:"none",
      showRegist:"none",
      memberleve:"",
      memberpoint:"",

      //以下为轮播参数
      imgUrls: [
        {
          link:"/pages/a_my_help_1/a_my_help_1",
          url: "../../images/my_nav_1.png"
        },
        {
          link: "",
          url: "../../images/my_nav_2.png"
        }
      ],
      indicatorDots: true,  
      autoplay: true,  
      interval: 5000,  
      duration: 1000,  
      swiper_height:0,
      imagewidth:"100%",
      imageMarginleft:"0rpx"
  },
  //查询数据
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
  },
  onLoad: function (e) {//页面加载结束执行方法
    var that = this;
    //计算轮播图高度
    wx.getSystemInfo({
        success: function(res) {
            var windowHeight = res.windowHeight;//576
            var windowWidth = res.windowWidth;//375
            var swiper_height = (windowHeight-windowWidth/750*(320+542))*(750/windowWidth);
            that.setData({swiper_height:swiper_height});

            //图片分辨率 宽高比  4
            var wt = swiper_height*4;//图片宽，单位rpx
            var ml = -wt/2;
            that.setData({ imageMarginleft: ml + "rpx", imagewidth: wt + "rpx"});
        }
    })

    
    //判断用户是否登录
    if(app.isLogin()){
        that.initData();
    }else{
    	if(wx.showLoading){
    		// wx.showLoading({title:"努力加载中"});
        }
        app.appLogin(function(res){
        	if(wx.hideLoading){
        		wx.hideLoading();
        	}
             if(res.data.Error==0 && res.data.data.is_reg==0){//--- 写死数据
                that.setData({nextType:0});
                wx.navigateTo({url:'/pages/a_register/a_register'})
             }else if(res.data.Error==0){
                that.initData();
             }else {
                wx.showToast({title: res.data.Msg,image:'../../images/error.png'});
             }
        });
    }
  },
  onShow:function(e){//当前页面重新显示
    var that = this;
    if (that.data.nextType==0){
      if(app.isLogin()){
          that.initData();
      }else{
          that.setData({showMain:"none",showRegist:"block"});
      }
      that.setData({nextType:-1});
    }
  },
  
  //初始化数据
  initData:function(){
      this.setData({showMain:"block",showRegist:"none"});
      var appUserInfo = app.getAppUserInfo(); 
      var Gid = appUserInfo.gid;// 394:水晶       393:珍珠    397:黄金  395：钻石   396：翡翠
      if (Gid==394) {// 水晶
          this.setData({card:"../../images/shuijing.png",memberleve:"水晶会员"});
      } else if (Gid==393) {// 珍珠
          this.setData({card:"../../images/zhenzhu.png",memberleve:"珍珠会员"});
      } else if (Gid==397) {// 黄金
          this.setData({card:"../../images/huangjin.png",memberleve:"黄金会员"});
      } else if (Gid==395) {// 钻石
          this.setData({card:"../../images/zhuanshi.png",memberleve:"钻石会员"});
      } else if (Gid==396) {// 翡翠
          this.setData({card:"../../images/feicui.png",memberleve:"翡翠会员"});
      }else{
          this.setData({card:"../../images/shuijing.png",memberleve:"水晶会员"});
      }

      if(null!=appUserInfo.headimg && ""!=appUserInfo.headimg){
          this.setData({headurl:appUserInfo.headimg});
      }

      this.setData({username:appUserInfo.name});
      this.queryPoint();
      //this.queryNav();

      
        
  },

  queryPoint:function () {//查询积分
    var that = this;
    wx.request({
      url: app.getUrl("fetchPoint"),
      data: app.getData({}),
      header: app.getHeader(),
      success: function (res) {
        if (res.data.Error == 0) {
          var point = res.data.data.integral.AmtPoint + res.data.data.integral.OnlineAmtPoint;
          var TotalPoint = res.data.data.integral.AmtTotalPoint + res.data.data.integral.OnlineAmtTotalPoint;
          //that.setData({ point: "兑换积分：" + point + "分", TotalPoint: "升级积分：" + TotalPoint + "分"});
          that.setData({memberpoint:point + "分"});
        }
      }
    })
  },

  queryNav:function(){//查询轮播图
    var that = this;
    wx.request({
      url: app.getUrl("temptest"),
      data: app.getData({}),
      header: app.getHeader(),
      success: function (res) {
        if (res.data.Error == 0) {
            that.setData({imgUrls:res.data.Data});
        }
      }
    })
  },
  //绑定事件 - 扫一扫
  bindScan:function(){
    wx.showToast({title:"敬请期待"});
    /*
    wx.scanCode({
        success: (res) => {
          var resultSplit = res.result.split("://");
          if (resultSplit[0]=="pay"){
            wx.navigateTo({ url: '/pages/a_my_scan_pay/a_my_scan_pay?scancode=' + res.result });
          }else{
            wx.showToast({ title: "未识别的二维码" });
          }
        }
    })
    */
  },
  //绑定事件 - 会员卡
  bindMembercard:function(){
    wx.navigateTo({url:'/pages/a_grhy_hyk/a_grhy_hyk'});
  },
  //绑定事件 - 消费积分
  bindCostPoint:function(){
    wx.navigateTo({url:'/pages/a_my_costpoint/a_my_costpoint?console=0'});
  },
  //绑定事件 - 家庭成员
  bindFamilyMember:function(){
    wx.navigateTo({url:'/pages/a_jthy/a_jthy'});
  },
  //绑定事件 - 卡券包
  bindCardPackage:function(){
    wx.navigateTo({url:'/pages/a_my_card/a_my_card'});
  },
  //绑定事件 - 付钱
  bindPay:function(){
    var that = this;
    if(wx.showLoading){
    	wx.showLoading({ title: "努力加载中" });
    }
    wx.request({
      url: app.getUrl("checkOpenPay"),
      data: app.getData({}),
      header: app.getHeader(),
      success: function (res) {
        console.log("付款");
        console.log(res);
    	  if(wx.hideLoading){
    		  wx.hideLoading();
      	}
        if (res.data.Error == 0) {
            if (res.data.data.XlDYK == 0) {// 未开通,跳转开通支付
                wx.navigateTo({url:'/pages/a_grhy_open_wallet/a_grhy_open_wallet'});
            } else if (res.data.data.XlDYK == 2) {// 未绑定，跳转大院卡绑定
                wx.navigateTo({url:'/pages/a_grhy_bind_wallet/a_grhy_bind_wallet'});
            } else {// 开通成功，进入我的钱包
                wx.navigateTo({url:'/pages/a_my_pay/a_my_pay'});
            }
        }
      }
    })
    
  },
  //绑定事件 - 注册  
  bindRegist:function(){
      this.setData({nextType:0});
      wx.navigateTo({ url:'/pages/a_register/a_register'});
  },
  //绑定事件 - 描述
  bindDescribe:function(){
      wx.navigateTo({ url:'/pages/a_my_describe/a_my_describe'});
  },
  //绑定事件 - 积分
  bindPoint:function(){
      wx.navigateTo({ url:'/pages/a_my_costpoint/a_my_costpoint?console=1'});
  },
  //绑定事件 - 帮助
  bindHelp:function(){
            wx.navigateTo({ url:'/pages/a_my_help/a_my_help'});
  },
  //绑定事件 - 轮播图
  bindNav:function(res){
    var link = res.currentTarget.dataset.link;
    if(null!=link && ""!=link && "null"!=link){
      wx.navigateTo({ url: link });
    }
  },
  //绑定事件 - 会员活动
  bindMemberActivity: function (res) {
    wx.showToast({ title: "敬请期待" });
  },
  //绑定事件 - 积分商城
  bindPointStroe: function (res) {
    wx.showToast({ title: "敬请期待" });
  },
  //绑定事件 - 微信运动
  bindWxSport:function(res){
    //wx.navigateTo({ url: '/pages/a_my_sport/a_my_sport'});
    wx.showToast({ title: "敬请期待" });
  }
  
})

