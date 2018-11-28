var app = getApp();  
var util = require('../../utils/util.js')
Page({  
    data: {
        codeText:"获取验证码",
        second:60,//倒计时
        clicFlag:true,//是否可用
        focus: false,
        inputValue: '',
        index: 1,
        toast1Hidden:true,  
        modalHidden: true,  
        modalHidden2: true,  
        notice_str: '',
        finish:false
    },
        bindPickerChange: function(e) {
        this.setData({
        index: e.detail.value
        })
    },
    bindKeyInput: function (e) {
        this.setData({
        inputValue: e.detail.value
        })
    },
    bindReplaceInput: function (e) {
            var value = e.detail.value
            var pos = e.detail.cursor
            var left
            if (pos !== -1) {
                    left = e.detail.value.slice(0, pos)// 光标在中间
                    pos = left.replace(/11/g, '2').length// 计算光标的位置
            }

            // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
            return {
                value: value.replace(/11/g, '2'),
                cursor: pos
            }
    },
    toast1Change:function(e){  
        this.setData({toast1Hidden:true});  
    },  
    PhoneInputChange: function(e) {
        this.data.phone = e.detail.value;
    },
    onPullDownRefresh: function () {
      var that = this;
      that.onLoad();
      wx.stopPullDownRefresh();
    },
    onLoad:function(options){  
        var that = this
        var appUserInfo=app.getAppUserInfo();
        var idcard=that.plusXing(appUserInfo.idcard);
        var vipcode = that.plusXing(appUserInfo.vipcode);
        var phone = that.plusXing(appUserInfo.phone);
        that.setData({ data: appUserInfo, idcard: idcard,
          vipcode: vipcode, phone: phone});
    },    
    // onLoad:function(options){  
   
    // },  
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
    	this.setData({finish:true});
    },  

    //获取验证码
    GetCode: function (e) {
        var that = this;
        if(!that.data.clicFlag){//是否可点击
            return;
        }
        if(!this.checkPhone()){//校验手机号
            return;
        }
        var appUserInfo = app.getAppUserInfo();
        wx.request({
            url: app.getUrl("sendPhoneCode"),
            data: app.getData({ phone: appUserInfo.phone, type: app.getConstant("CHECKCODE_OPENPAY") }),
            header: app.getHeader(),
            success: function(res) {
                if(res.data.Error==0){
                    that.setData({clicFlag:false});
                    that.countDownFunc();
                }else{
                    wx.showToast(res.data.Msg);
                }
            }
        })
    },
    //倒计时
    countDownFunc:function(){
        if(this.data.clicFlag){
            this.setData({codeText:"获取验证码"});
        }else{
            if(this.data.second<=0){//计时结束
                this.setData({codeText:"获取验证码",clicFlag:true,second:60});
            }else{//计时未结束
                this.setData({codeText:this.data.second+"s后重新获取"});
                this.setData({second:(this.data.second-1)});
                if (!this.data.finish){
                	setTimeout(this.countDownFunc, 1000);
                }
            }
        }
    },
    //提交
    formSubmit: function (e) {
        if(!this.checkSubmit(e)){//校验
            return;
        }
        if(wx.showLoading){
        	wx.showLoading({title:"开通中"});
        }
            wx.request({
                url: app.getUrl("XlkRegister"),
                data: app.getData({ yzmcode: e.detail.value.code, pass: e.detail.value.password, idcode: e.detail.value.idcard}),
                header: app.getHeader(),
                success: function(res) {
                	if(wx.hideLoading){
                		wx.hideLoading();
                	}
                    if(res.data.Error==0){
                        //wx.navigateBack();
                      wx.reLaunch({ url: '/pages/a_my/a_my' });
                    }else{
                        wx.showToast({title:res.data.Msg,image:'../../images/error.png'});
                    }
                }
            });
        
  },
  //提交校验
  checkSubmit:function(e){
    var appUserInfo = app.getAppUserInfo();
    if (app.Trim(appUserInfo.name).length==0){
        wx.showToast({title: "请输入姓名",image:'../../images/error.png'});
        return false;
    }

    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
    if (reg.test(e.detail.value.idcard) === false)  
    {  
       wx.showToast({title: "请输入正确身份证号码",image:'../../images/error.png'});
       return  false;  
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
    if (!myreg.test(appUserInfo.phone)){ //验证未通过
        wx.showToast({title: "请输入正确的手机号",image:'../../images/error.png'});
        return false; 
    }
    if(e.detail.value.code.length<6){
        wx.showToast({title: "请输入6位手机验证码",image:'../../images/error.png'});
        return false;
    }

    if(e.detail.value.password.length<6){
        wx.showToast({title: "请输入至少6位密码",image:'../../images/error.png'});
        return false;
    }

    if (e.detail.value.password!=e.detail.value.password2){
        wx.showToast({title: "两次密码输入不一致",image:'../../images/error.png'});
        return false;
    }
      
    return true;  
  },
  //手机号校验
  checkPhone:function(){
      var that = this;
      var appUserInfo = app.getAppUserInfo();
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
      if(!myreg.test(appUserInfo.phone)){ //验证未通过
           wx.showToast({title: "请输入正确的手机号",image:'../../images/error.png'});
          return false; 
      }
      return true;
  },
  
  plusXing:function(str) { 
    var that = this;
    var len = str.length - 3 - 4;
    var xing = '';
    for(var i= 0;i<len;i++) {
  xing += '*';
}
return str.substr(0, 3) + xing + str.substr(str.length - 4);
}
    
    
})