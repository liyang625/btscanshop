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
        index: 10,
        toast1Hidden:true,  
        modalHidden: true,  
        modalHidden2: true,  
        notice_str: ''
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
      if (options.vipName){
        wx.request({
          url: app.getUrl("GetMastRelList"),
          header: app.getHeader(),
          success: function (res) {
            console.log(res.data);
            that.setData({
              user: options,
              data: res.data.Data,
              array: res.data.Data.map(function (e) {
                return e.mastRelName;
              }),
              arr: res.data.Data.map(function (e) {
                return e.mastRel;
              }),
            })
          }
        })	
      }else{
        that.setData({ famJoinMode: options.famJoinMode})
      }
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
    },  

    //提交
    formSubmit: function (e) {
       var that = this
       if (e.detail.value.name){
         if (undefined == e.detail.value.mastRel || null == e.detail.value.mastRel || "" == e.detail.value.mastRel){
           wx.showToast({ title: "请选择关系", image: '../../images/error.png' });
           return false;
         }

         var appUserInfo = app.getAppUserInfo();
         if (e.detail.value.famJoinMode == 2 ) {
           if (e.detail.value.famId == '' && e.detail.value.role =="NONE_FAMILY"){
             
                 var postData = {
                   cardno: e.detail.value.vipcode,//邀请/申请加入的会员号
                   paperno: e.detail.value.idcard,//邀请/申请加入的身份证号
                   jmodel: e.detail.value.famJoinMode,  //家庭加入方式（必需，线上户主邀请2，线上成员申请3）
                   mastrel: e.detail.value.mastRel,  //与户主关系代码（必需，通过Dayuan_GetMastRelList获得）
                   mastrelname: e.detail.value.mastRelName,//与户主关系代码（必需，通过Dayuan_GetMastRelList获得）
                 };
                 wx.request({
                   url: app.getUrl("sendInvitation"),
                   data: app.getData(postData),
                   header: app.getHeader(),
                   success: function (res) {
                	   if(wx.hideLoading){
                		   wx.hideLoading();
                   	}
                     if (res.data.Error == 0) {
                       wx.showToast({ title: "邀请成功" ,duration: 2000});
                       wx.navigateTo({ url: '/pages/a_jthy/a_jthy' });
                     } else {
                       wx.showToast({ title: res.data.Msg, image: '../../images/error.png' });
                     }
                   }
                 })
           } else {
             wx.showToast({ title: '该会员在家庭中不能被邀请', image: '../../images/error.png' });
           }
         } else if (e.detail.value.famJoinMode == 3 ){
           if (e.detail.value.famId != '' && e.detail.value.role == "MAST_VIP") {
             var postData = {
               cardno: e.detail.value.vipcode,//邀请/申请加入的会员号
               paperno: e.detail.value.idcard,//邀请/申请加入的身份证号
               jmodel: e.detail.value.famJoinMode,  //家庭加入方式（必需，线上户主邀请2，线上成员申请3）
               mastrel: e.detail.value.mastRel,  //与户主关系代码（必需，通过Dayuan_GetMastRelList获得）
               mastrelname: e.detail.value.mastRelName,//与户主关系代码（必需，通过Dayuan_GetMastRelList获得）
             };    
             wx.request({
               url: app.getUrl("sendInvitation"),
               data: app.getData(postData),
               header: app.getHeader(),
               success: function (res) {
            	   if(wx.hideLoading){
            		   wx.hideLoading();
               	}
                 if (res.data.Error == 0) {
                   wx.showToast({ title: "申请成功", duration: 2000});
                   wx.navigateTo({ url: '/pages/a_jthy/a_jthy' });
                 } else {
                   wx.showToast({ title: res.data.Msg, image: '../../images/error.png' });
                 }
               }
             })  
           } else if (e.detail.value.famId != '' && e.detail.value.role == "MEM_VIP") {
             wx.showToast({ title: '该会员不是户主不能申请加入', image: '../../images/error.png' });
           }else {
           wx.showToast({ title: '该会员不在家庭中不能申请加入', image: '../../images/error.png' });
         }
        }
         
      }else{ 
    	  if(wx.showLoading){
    		  wx.showLoading({ title: "查询中" });
          }
        var famJoinMode = e.detail.value.famJoinMode;
        if (!e.detail.value.idcard) {
          wx.showToast({ title: "请输入身份证号", image: '../../images/error.png' });
          return false;
        }
        if (!e.detail.value.vipcode) {
          wx.showToast({ title: "请输入会员卡号", image: '../../images/error.png' });
          return false;
        }
          var postData = {
            cardno: e.detail.value.vipcode,
            paperNo: e.detail.value.idcard
          };
          wx.request({
            url: app.getUrl("getVipInfoAndFamilyRoleByPapernoCardno"),
            data: app.getData(postData),
            header: app.getHeader(),
            success: function (res) {
            	if(wx.hideLoading){
            		wx.hideLoading();
            	}
              console.log(res.data);
              if (res.data.Error == 0) {
                var options = res.data.Data;
                options.famJoinMode = famJoinMode;
                that.onLoad(options);
              } else {
                wx.showToast({ title: res.data.Msg, image: '../../images/error.png' });
              }
            }
          })
      }
        
  },
  //提交校验
  checkSubmit:function(e){
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
    if(reg.test(e.detail.value.idcard) === false)  
    {  
       wx.showToast({title: "请输入正确身份证号码",image:'../../images/error.png'});
       return  false;  
    }
    if (app.Trim(e.detail.value.mastRel).length == 0) {
      wx.showToast({ title: "请选择与被邀请人的关系", image: '../../images/error.png' });
      return false;
    }
    return true;  
  },
  
  
    
    
})