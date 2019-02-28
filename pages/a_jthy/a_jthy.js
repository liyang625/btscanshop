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
    showMain:"none",
    showRegist:"none",
    motto: 'Hello World',
    
    userInfo: {}//用户信息
  },

  //绑定事件 - 家庭权益
  bindJtqy:function(){
    wx.navigateTo({url:'/pages/a_jthy_com/a_jthy_com?com=1'});
  },
  //绑定事件 - 积分规则
  bindJfgz:function(){
    wx.navigateTo({url:'/pages/a_jthy_com/a_jthy_com?com=2'});
  },
  //绑定事件 - 成员规则
  bindCygz:function(){
    wx.navigateTo({url:'/pages/a_jthy_com/a_jthy_com?com=3'});
  },
  //绑定事件 - 注册  
  bindRegist:function(){
      this.setData({nextType:0});
      wx.navigateTo({ url:'/pages/a_register/a_register'});
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //绑定事件--邀请会员
  request: function (e) {
    wx.navigateTo({ url: '/pages/a_request/a_request?famJoinMode=2'});
  },
  tapName: function (event) {
  },
  remove: function (e) {
    var that = this;
    var appUserInfo = app.getAppUserInfo();
    if (e.target.dataset.memremmode==1){//户主移除

      var content='您成为移出该家庭成员后，该会员卡上的积分将合并到主卡上。该的会员卡将变为积分为零的水晶会员卡。';
      var cardno= appUserInfo.vipcode;
    }else{//成员申请
      var content = '您成为退出家庭后，您会员卡上的积分将合并到主卡上。您的会员卡将变为积分为零的水晶会员卡。';
      var cardno = e.target.dataset.mastcardno;
    }
    wx.showModal({
      title: '重要提示',
      content: content,
      success: function (res) {
        if (res.confirm) {
          var postData = {
            "memCardno": e.target.dataset.memcardno, //移除的成员会员号（必需）
          };
          wx.request({
            url: app.getUrl('familyRemMem'),
            data: app.getData(postData),
            header: app.getHeader(),
            success: function (res) {
              if (res.data.Error == 0) {
                wx.showToast({ title: "操作成功!" });
                that.onLoad();
              }
            }
          })
        }
      }
    })
  },
  jionFamily:function(){
    wx.showModal({ 
      title: '重要提示', 
      content: '您成为家庭成员后，您会员卡上的积分将合并到主卡上并共享积分。当主卡与您解除家庭成员关系后，您的会员卡将变为积分为零的水晶会员卡。', 
      success: function (res) { 
        if (res.confirm) { 
          wx.navigateTo({ url: '/pages/a_request/a_request?famJoinMode=3' });
          } 
        } 
   }) 
  },
  setFamily: function () {
    var that = this;
    wx.showModal({
      title: '重要提示',
      content: '您成为户主后，您所邀请家庭成员会员卡上的积分将合并到您的卡上且共享积分。当您与此家庭成员解除关系后，被解除家庭会员的会员卡将变为积分为零的水晶会员卡。',
      success: function (res) {
        if (res.confirm) {
          var appUserInfo = app.getAppUserInfo();
          var postData = {"cardno": appUserInfo.vipcode};
          wx.request({
            url: app.getUrl("createFamily"), //创建家庭接口
            data: app.getData(postData),
            header: app.getHeader(),
            success: function (res) {
              if (res.data.Error==0){
                that.onLoad();
              }
            }
          })
        }
      }
    })
  },
  onShow:function(){//当前页面重新显示
    console.log("家庭会员：onShow");
    if(this.data.nextType==0){
      if(app.isLogin()){
          this.initPage();
      }else{
          this.setData({showMain:"none",showRegist:"block"});
      }
      this.setData({nextType:-1});
    }
  },
  onPullDownRefresh: function () {
    var that = this;
    wx.stopPullDownRefresh();
    that.onLoad();
  },
  onLoad: function () {//页面加载结束执行方法
    console.log("家庭会员：onLoad");
      var that = this;
      //判断用户是否登录
      if(app.isLogin()){//--- 登录查询家庭会员信息
          var appUserInfo=app.getAppUserInfo();
          var postData = {
                "cardno":appUserInfo.vipcode
              //"cardno":"6300001622605"
              //"cardno":"6300001669912"
          };
          wx.request({
              url: app.getUrl("getFamilyInfoByVip"), //家庭会员接口
              data: app.getData(postData),
              header: app.getHeader(),
              success: function(res) {
                  if (res.data.data){
                      that.setData({
                          famId: res.data.data.id, 
                          data: res.data.data.mastVip, 
                          family: res.data.data.memVip, 
                          cardno: appUserInfo.vipcode
                      });
                      
                      if(res.data.data.mastVip && res.data.data.mastVip.vipCode){
                        that.setData({mastCardno: res.data.data.mastVip.vipCode});
                      }
                  }else{
                      that.setData({data: 1});
                  }
                  that.initPage();//初始化页面
              }
          });
          
      }else{
    	    if(wx.showLoading){
    		      wx.showLoading({title:"努力加载中"});
          }
          app.appLogin(function(res){
              if(wx.hideLoading){
                wx.hideLoading();
              }
              if(res.data.Error==0 && res.data.data.is_reg==0){//--- 写死数据
                  that.setData({nextType:0});
                  wx.navigateTo({url:'/pages/a_register/a_register'})
              }else if(res.data.Error==0){
                  that.initPage();
              }else {
                  wx.showToast({title: res.data.Msg,image:'../../images/error.png'});
              }
          });
      }

  },
  //初始化页面
  initPage:function(){
      this.setData({showMain:"block",showRegist:"none"});
      //this.queryNav();
  },
  queryNav:function(){//查询导航数据
      var that = this;
      wx.request({
          url: app.getUrl("getShopNavForFlex"), //仅为示例，并非真实的接口地址
          data: app.getData({flex_type:"app"}),
          header: app.getHeader(),
          success: function(res) {
            var dataArray = new Array();
            for(var i=0;i<2;i++){
                for(var j=0;j<res.data.data[0].length;j++){
                    dataArray[dataArray.length] = res.data.data[0][j];
                }
            }
            that.setData({nav: dataArray});
          }
      })
  },
  onShareAppMessage: function () {
    return {
      title: '兴隆大院',
      desc: '兴隆大院小程序!',
      path: '/pages/a_jthy/a_jthy',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success'
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败'
        })
      }
    }
  }
})

