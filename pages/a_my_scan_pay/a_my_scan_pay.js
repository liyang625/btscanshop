//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
var md5 = require('../../utils/md5.js')
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
    payOrg:"",
    payOrgStore:"",
    payPoint:"",//支付积分
    payMemo:"",//支付备注
    scancode:"",//扫描的二维码信息
    payNo:"",//支付号
    payBatchInx:"",//第一步创建订单返回支付批次
    argOutNo:"",//外部交易号 第一步创建订单请求参数
  },
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
  },
  onLoad: function (res) {//页面加载结束执行方法
    this.setData({scancode: res.scancode});
    //this.setData({ scancode: "pay://321962026341498880/323809520516071424/334646949246533825" });
    this.queryData();
    //var ts = this.getTs();
    //var token = this.getToken(ts);

  },
  //初始化数据
  initData:function(){
     
  },

  //支付成功返回上一页
  paySuccess:function(){
    wx.showToast({
        title:"支付成功",
        icon: 'success',
        duration:3000,
        mask:true,
        complete:function(){
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000);
        }
    });
  },

  //获取Ts,精确到秒
  getTs:function(){
    var returncode = new Date().getTime()+"";
    returncode = returncode.substring(0, returncode.length-3);
    return returncode;
  },

  //获取token
  getToken:function(ts){
    /*
    1.	将argErp, ts, skey拼接起来的字符串进行md5加密即得到sig
    2.	拼接顺序必须为cardid, ts, skey
    3.	md5后的结果为小写字符
    argErp: 	2    :代表小程序
    ts:		1364955939    ：时间戳 毫秒
    skey:	518e156e-f11c-4a5f-9e6e-a2c17f69bef3   ：小程序 固定
    */
    var returncode = "2" + ts +"951ef0bfdd054270a5c992a3eddca4e2";
    //var returncode = "11364955939518e156e-f11c-4a5f-9e6e-a2c17f69bef3";
    returncode = md5.hex_md5(returncode);
    return returncode;
  },

  //获取基础数据
  queryData:function(){
      var userinfo = app.getAppUserInfo();
      var that = this;
      if(wx.showLoading){
    	  wx.showLoading({title:"正在获取支付信息"});
      }


      var ts = this.getTs();
      var token = this.getToken(ts);
      var argOutNo = app.getUUID();

      var postUrl = "http://123.56.184.117:8080/vip-shop-service/shop/pay/ScanpayController/createTrade"
      var postData = {
        argBarcodeInfo: that.data.scancode,
        argErp: "2",//固定
        argOriVipId: userinfo.id,//用户原始ID
        ts: ts,
        token: token,
        argOutNo: argOutNo
      };

      console.log("查询参数");
      console.log(postData);


      wx.request({
        url: util.getUrlVipShop("createTrade"),
          data: app.getData(postData),
          header: app.getHeader(),
          success: function(res) {
            console.log("查询详情");
            console.log(res);
        	  if(wx.hideLoading){
        		  wx.hideLoading();
          	}

            if (res.data.errCode == "0") {//获取数据从公
                var frHandOrgName = res.data.result.frHandOrgName;
                var frHandOrgNameArray = frHandOrgName.split("-");
                that.setData({ 
                    payOrg: frHandOrgNameArray[1] + "-" + frHandOrgNameArray[2],
                    payOrgStore: frHandOrgNameArray[frHandOrgNameArray.length-1],
                    payNo: res.data.result.payNo,
                    payBatchInx: res.data.result.payBatchInx,
                    argOutNo: postData.argOutNo
                });
            }else{
                wx.showToast({ title: result.errMessage });
            }
            
          }
      })
  },

  //支付
  pay: function () {

    var that = this;
    if (wx.showLoading) {
      wx.showLoading({ title: "正在支付" });
    }

    var ts = this.getTs();
    var token = this.getToken(ts);
    var argOutNo = app.getUUID();

    var postUrl = "http://123.56.184.117:8080/vip-shop-service/shop/pay/ScanpayController/pay"
    var postData = {
      argBarcodeInfo: that.data.scancode,
      argErp: "2",//固定
      argPayNo: this.data.payNo,//支付单号
      argPayType: "1",//支付方式1：积分 2：支付中心 3：微支付 4：银行卡  5：大院卡
      ts: ts,
      token: token,
      argOutNo: argOutNo,
      argAmt: this.data.payPoint,
      argRemark: this.data.payMemo
    };

    console.log("支付参数");
    console.log(postData);
    
    wx.request({
      url: util.getUrlVipShop("pay"),
      data: app.getData(postData),
      header: app.getHeader(),
      success: function (res) {
        console.log("支付结果");
        console.log(res);

        if (wx.hideLoading) {
          wx.hideLoading();
        }

        if (res.data.errCode=="0"){//支付成功
          if (res.data.result.isSuccess && res.data.result.isValidity) {//支付成功
              that.paySuccess();
            } else {//检查支付成功
              that.checkPayResult();
            }
        }else{//支付失败
          wx.showToast({ title: result.errMessage });
        }

      }
    })
  },


  //检查支付
  checkPayResult: function () {

    var that = this;
    if (wx.showLoading) {
      wx.showLoading({ title: "正在检查支付结果" });
    }

    var postUrl = "http://123.56.184.117:8080/vip-shop-service/shop/pay/ScanpayController/queryPayInfo"
    var postData = {
      argOutNo: that.data.argOutNo,
      argErp:"2",
      argPayBatchInx: that.data.payBatchInx
    };

    console.log("检查支付参数");
    console.log(postData);

    wx.request({
      url: util.getUrlVipShop("queryPayInfo"),
      data: app.getData(postData),
      header: app.getHeader(),
      success: function (res) {
        console.log("检查支付结果");
        console.log(res);

          if(that.data.index==5){
            return;
          }
          if (res.data.errCode == "0") {//支付成功
            if (res.data.result.isSuccess && res.data.result.isValidity) {//支付成功
                if (wx.hideLoading) {
                  wx.hideLoading();
                }
                that.paySuccess();
            } else {//继续检查支付成功
              setTimeout(function () {
                that.checkPayResult();
              }, 500);
            }
          } else {//支付失败
            if (wx.hideLoading) {
              wx.hideLoading();
            }
            wx.showToast({ title: res.data.errMessage });
          }

      }
    })
  },


  //绑定事件 - 支付
  bindPay:function(){
    if (this.data.payPoint==""){
      wx.showToast({title: "请输入积分"});
      return;
    }

    this.pay();

  },

  //绑定事件 - 只能输入正整数
  bindInputNum:function(res){
    console.log(res.detail.value);
    this.setData({payPoint:res.detail.value.replace(/\b(0+)/gi, "")});
    return res.detail.value.replace(/\b(0+)/gi, "");
  },

  //绑定事件 - 备注
  bindInputMemo: function (res) {
    this.setData({ payMemo: res.detail.value});
  },

  //绑定事件 - 选择其他方式支付
  bindChangeOtherPay:function(tes){
    wx.showToast({ title: "敬请期待" });
  }
})

