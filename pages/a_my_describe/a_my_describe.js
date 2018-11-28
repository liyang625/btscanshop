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
     checkIndex:0,//0:我的门店     1：会员权益    2：升级规则
     data:[],
     strRand:"",
     code:"",//显示验证码路径
     inputCode:"",//输入验证码
     comname:[],//常去门店名称
     comcode:[],//常去门店代码
     index:0,//当前选择常去门店角标
     comcodeStr:"",//用户常去门店code
     username:"",
     idcard:"",
     phone:""
  },
  onLoad: function () {//页面加载结束执行方法
      var that = this;
      this.changeCode();  
      app.getUserInfoDetail(function(res){

          var idcard = "000***********0000";
          var comcodeStr = "";
          var username = "";
          var phone = "";

          if (undefined != res && undefined != res.data && undefined != res.data.userplus && undefined != res.data.userplus.idcard){
                var idcard = res.data.userplus.idcard;
                idcard = idcard.substring(0,3)+"***********"+idcard.substring(idcard.length-4,idcard.length);
          }

          if (undefined != res && undefined != res.data && undefined != res.data.comcode) {
            comcodeStr = res.data.comcode;
          }

          if (undefined != res && undefined != res.data && undefined != res.data.userplus && undefined != res.data.userplus.name) {
            username = res.data.userplus.name;
          }

          if (undefined != res && undefined != res.data && undefined != res.data.userplus && undefined != res.data.userplus.phone) {
            phone = res.data.userplus.phone;
          }

          that.setData({
              comcodeStr: comcodeStr,
              username: username,
              idcard: idcard,
              phone: phone
          });

          that.queryData();
          
      });
  },
  //绑定事件 - 我的门店
  bindMystore:function(){
    this.setData({checkIndex:0});
    
  },
  //绑定事件 - 会员权益
  bindMemberRights:function(){
    this.setData({checkIndex:1});
  },
  //绑定事件 - 升级规则
  bindUpgradeRule:function(){
    this.setData({checkIndex:2});
  },
  //修改常去门店
  updateData:function(){
      if(this.data.inputCode.length==0){
        wx.showToast({title: "请输入验证码",image:'../../images/error.png'});
        return;
      }

      var that = this;
      if(wx.showLoading){
    	  wx.showLoading({title:"保存中"});
      }
      wx.request({
          url: app.getUrl("updateCard"),
          data: app.getData({
              strRand:that.data.strRand,
              code:that.data.inputCode,
              comcode:that.data.comcode[that.data.index]
          }),
          header: app.getHeader(),
          success: function(res) {
        	  if(wx.hideLoading){
        		  wx.hideLoading();
          	}
              if(res.data.Error==0){
                  wx.showToast({title: "保存成功"});
              }else{
                  wx.showToast({title: res.data.Msg,image:'../../images/error.png'});
              }
          }
      })
  },
  //输入验证码
  inputChange:function(e){
    this.setData({inputCode:e.detail.value});
  },
  //更改验证码
  changeCode:function(){
      var strRand = "";
      for(var i=0;i<6;i++){
          strRand+=Math.floor(Math.random()*10);
      }
      this.setData({
          strRand:strRand,
          code:app.getUrl("getMathCode")+"?strRand="+strRand
      });
  },
  //修改常去企业
  changeGoFunc:function(e){
    this.setData({index:e.detail.value});
  },
  //查询常去门店
  queryData:function(){
      var that = this;
      if(wx.showLoading){
    	  wx.showLoading({title:""});
      }
      wx.request({
          url: app.getUrl("GetComList"),
          data: app.getData({}),
          header: app.getHeader(),
          success: function(res) {
        	  if(wx.hideLoading){
        		  wx.hideLoading();
          	}
              if(res.data.Error==0){
                  var index = 0;
                  var comname = new Array();
                  var comcode = new Array();
                  for(var i=0;i<res.data.data.length;i++){
                    comname[comname.length] = res.data.data[i].comName;
                    comcode[comcode.length] = res.data.data[i].comCode;
                    if(res.data.data[i].comCode==that.data.comcodeStr){
                        index = i;
                    }
                  }
                  that.setData({
                      index:index,
                      comname:comname,
                      comcode:comcode
                  });
              }
          }
      })
  },
})

