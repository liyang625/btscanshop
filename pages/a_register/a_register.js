var app = getApp();  
var util = require('../../utils/util.js')
Page({  
  /**分享 */
  onShareAppMessage: function () {
    return {
      title: '兴隆大院+',
      desc: '你想要的都在这里!',
      path: '/pages/a_my/a_my'
    }
  },
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
  
    onLoad:function(options){  
            var that = this
            wx.request({
                url: app.getUrl("GetComList"),
                header: app.getHeader(),
                success: function (res) {  
                    that.setData({   
						data: res.data.data,
                        array:res.data.data.map(function(e){
                            return e.comName;
                        }),
                        arr:res.data.data.map(function(e){
                            return e.comCode;
                        }),
                    }) 
                }  
            })	
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

        var postData = {phone:that.data.phone,type:app.getConstant("CHECKCODE_REG")};
        wx.request({
          url: app.getUrl("sendPhoneCode"),
          data: app.getData({ phone: that.data.phone, type: app.getConstant("CHECKCODE_REG") }),
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
        	wx.showLoading({title:"注册中"});
        }
        app.getWxUserInfo(function(userinfo){
            var password_rand = "";
            for(var i=0;i<6;i++){
                password_rand += Math.floor(Math.random()*9);
            }

            var re = wx.getSystemInfoSync();
            var postData = {
              "info[name]": e.detail.value.name,
              "info[comcode]": e.detail.value.comcode,
              "info[phone]": e.detail.value.phone,
              "info[code]": e.detail.value.code,
              "info[password_rand]": password_rand,
              "info[nickname]": userinfo.nickName,
              "info[headimg]": userinfo.avatarUrl,
              "info[is_xcx]": 1,
              "info[apifrom]": 'sapp' + app.localData.version
            }; 
            wx.request({
                url: app.getUrl("xlReg"),
                data: app.getData(postData),
                header: app.getHeader(),
                success: function(res) {
                	if(wx.hideLoading){
                		wx.hideLoading();
                	}
                    if(res.data.Error==0){
                      app.setLoginData(res.data.HeaderKey, res.data.Token,res.data.data);
                        wx.navigateBack();
                    }else{
                        wx.showToast({title:res.data.Msg,image:'../../images/error.png'});
                    }
                }
            })
        });



        
  },
  //提交校验
  checkSubmit:function(e){
    
    if(app.Trim(e.detail.value.name).length==0){
        wx.showToast({title: "请输入姓名",image:'../../images/error.png'});
        return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
    if(!myreg.test(e.detail.value.phone)){ //验证未通过
        wx.showToast({title: "请输入正确的手机号",image:'../../images/error.png'});
        return false; 
    }
    return true;  
  },
  //手机号校验
  checkPhone:function(){
      var that = this;
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
      if(!myreg.test(that.data.phone)){ //验证未通过
           wx.showToast({title: "请输入正确的手机号",image:'../../images/error.png'});
          return false; 
      }
      return true;
  },
  
  
    
    
})