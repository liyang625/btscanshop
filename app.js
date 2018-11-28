var WxParse     = require('components/wxParse/wxParse.js');
var util = require('utils/util.js');
var constant = require('utils/constant.js');
var codeArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

App({
  /**----------------------------- wuchao start -----------------------------*/

  /**本地数据 */
  localData: {
    version:"1.0.20",//小程序版本号
    code: null,//登录临时code
    codeMotion: null,//获取微信运动登录临时code
    userInfo: null,//用户信息
    HeaderKey: null,//登录标识
    Token:null,//Token
    appUserInfo: null//应用用户信息
  },

  /**公共方法 - 获取常量 */
  getConstant:function (key){
    return constant.getConstant(key);
  },

  /**公共方法 - 获取请求url */
  getUrl:function(key){
    return util.getUrl(key);
  },

  /**公共方法 - 获取数据,用来统一放入encryptedData*/
  getData:function(json){
    if(json && this.localData.HeaderKey){
        json["HeaderKey"] = this.localData.HeaderKey;
    }
    return json;
  },
  getHeader:function(){
    var returnObj = { 'content-type': 'application/json'};
    if (this.localData.HeaderKey) {
      returnObj["cookie"] = "BDed_HeaderKey_DJEHBSUAAY=" + this.localData.HeaderKey + ";BDed_Token=" + this.localData.Token;
    } 
    console.log("header");
    console.log(returnObj);
    return returnObj;
  },

  //获取32位随机数
  getUUID:function(){
      var resultcode = "";
      for(var i=0;i<32;i++){
        resultcode += codeArray[Math.ceil(Math.random() * (codeArray.length - 1))];
      }
      return resultcode;
  },

  /**判断用户是否登录*/
  isLogin:function(){
    if (!this.localData.Token){
      return false;
    }
    
    if(this.localData.appUserInfo){
      return true;
    }else{
      return false;
    }
  },

  /**公共方法 - 应用用户信息*/
  getAppUserInfo:function(){
    var that = this;
    if(that.localData.appUserInfo){
        return that.localData.appUserInfo;
    }

    if(appUserInfo = wx.getStorageSync('appUserInfo')){
        that.localData.appUserInfo = appUserInfo;
        return that.localData.appUserInfo;
    }
  },

  /**公共方法 - 时时获取用户详细信息 */
  getUserInfoDetail:function(cb){
			
      var that = this;
      wx.request({
            url: util.getUrl("fetchMemberInfo"),
            data: that.getData({}),
            header: that.getHeader(),
            success: function(res) {
                console.log("用户详细信息");
                console.log(res);
                var num = new Number(res.data.userplus.idcard);
                typeof cb == "function" && cb(res);
            }
      })
  },

  /**获取微信用户信息*/
  getWxUserInfo:function(cb){
      var that = this;
      if(this.localData.userInfo){//----写死数据
      //if(false){
        typeof cb == "function" && cb(this.localData.userInfo)
      }else{
        wx.login({//调用登录接口
            success: function (resroot) {
                if(resroot.code){
                    wx.getUserInfo({
                      success: function (res) {
                          that.localData.userInfo = res.userInfo;
                          that.localData.code = resroot.code;
                          wx.setStorageSync('userInfo',res.userInfo);
                          typeof cb == "function" && cb(res.userInfo)
                      },
                      fail: function () {
                        wx.showModal({
                          title: '警告',
                          content: '您点击了拒绝授权，将无法正常使用兴隆大院的功能体验。是否立即授权？',
                          success: function (res) {
                            if (res.confirm) {
	                          if(!wx.openSetting){
	                          	  wx.showToast({title: '微信版本太低，无法授权，请升级版本'});
	                          	  return;
	                          }
                            	
                            	
                              wx.openSetting({
                                  success: function (data) {
                                      if (data) {
                                          if (data.authSetting["scope.userInfo"] == true) {
                                              wx.getUserInfo({
                                                  withCredentials: false,
                                                  success: function (res) {

                                                      that.localData.userInfo = res.userInfo;
                                                      that.localData.code = resroot.code;
                                                      wx.setStorageSync('userInfo', res.userInfo);
                                                      typeof cb == "function" && cb(res.userInfo)
                                                  },
                                                  fail: function () {
                                                      console.info("2授权失败返回数据");
                                                  }

                                              });
                                          }
                                      }
                                },
                                fail: function () {
                                  console.info("设置失败返回数据");
                                }
                              });
                            }
                          }
                        })
                      }
                    })
                }
            }
        })
      }
  },

  

  /**用户登录 */
  appLogin:function(cb){
    var that = this;
    wx.removeStorageSync('HeaderKey');
    wx.removeStorageSync('Token');
    wx.removeStorageSync('appUserInfo');
    that.localData.HeaderKey = null;
    that.localData.Token = null;
    that.localData.appUserInfo = null;
    that.localData.userInfo = null;
    

    this.getWxUserInfo(function(userInfo){//获取用户信息
      var re = wx.getSystemInfoSync();
      var postData = { 
        code: that.localData.code,
        type: 1, 
        "nlogin":"1",
        "apifrom": 'sapp' + that.localData.version,
        "info[avatarUrl]": userInfo.avatarUrl,
        "info[city]": userInfo.city,
        "info[country]": userInfo.country,
        "info[gender]": userInfo.gender,
        "info[language]": userInfo.language,
        "info[province]": userInfo.province,
        "info[nickName]": userInfo.nickName
      };

			var codeurl = util.getUrl("Code2login");

        wx.request({
					url: codeurl,
             data: postData,
            success: function(res) {
              console.log("获取用户信息成功");
              console.log(res);
              wx.setStorageSync('HeaderKey', res.data.HeaderKey);
              wx.setStorageSync('Token', res.data.Token);
              that.localData.HeaderKey = res.data.HeaderKey;
              that.localData.Token = res.data.Token;

                if(res.data.Error==0 && res.data.data.is_reg==1){//成功登录
                    wx.setStorageSync('appUserInfo',res.data.data);
                   
                    that.localData.appUserInfo = res.data.data;
                }
                

                typeof cb == "function" && cb(res);
            },
						fail:function(res){
							console.log("获取用户信息失败信息");
							console.log(res);
						}
        })
    });
  },

  /**调用API从本地缓存中获取数据 */
  onLaunch: function () {
    var that = this;
    wx.checkSession({
        success: function(){
            var userInfo;
            var appUserInfo;
            var HeaderKey;
            var Token;

            if(HeaderKey = wx.getStorageSync('HeaderKey')){
              that.localData.HeaderKey = HeaderKey;
            }

            if (Token = wx.getStorageSync('Token')) {
              that.localData.Token = Token;
            }

            if(appUserInfo = wx.getStorageSync('appUserInfo')){
              that.localData.appUserInfo = appUserInfo;
            }

            if(userInfo = wx.getStorageSync('userInfo')){
              that.localData.userInfo = userInfo;
              // that.globalData.userInfo = userInfo;
            }
            that.getSystemInfo();
        },
        fail: function(){
          wx.login();
        }
    });
  },

  /**注册用 - 设置登陆后的数据 */
  setLoginData:function(HeaderKey,Token,appUserInfo){
      wx.setStorageSync('HeaderKey',HeaderKey);
      wx.setStorageSync('Token', Token);
      wx.setStorageSync('appUserInfo',appUserInfo);
      this.localData.HeaderKey = HeaderKey;
      this.localData.Token = Token;
      this.localData.appUserInfo = appUserInfo;
  },

  /**获取系统信息 */
  getSystemInfo : function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.systemInfo = res;
      }
    });
  },




  /**工具方法 - 去掉所有空格 */
  Trim:function (str){
    if (null == str || undefined == str || !str.replace){
      return str;
    }else{
      return str.replace(/\s/g, ""); 
    }
  },
  /**工具方法 - 格式化时间
   * yyyy-MM-dd hh:mm:ss
   * yyyy-MM-dd
   */
  formatTime:function (date,formatstr){
      var timeStr = "";
      if(date){
          var year = date.getFullYear();
          var month = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):date.getMonth()+1;
          var day = date.getDate()<10?"0"+date.getDate():date.getDate();
          var hours = date.getHours()<10?"0"+date.getHours():date.getHours();
          var minutes = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
          var seconds = date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
          if(formatstr=="yyyy-MM-dd hh:mm:ss"){
              timeStr = year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
          }else if(formatstr=="yyyy-MM-dd"){
              timeStr = year+"-"+month+"-"+day;
          }
      }
      return timeStr;
  },
   /**工具方法 - 计算两坐标点距离
   */
  getDisance: function (lat1,long1,lat2,long2) {
        var dis = 0;
        var radLat1 = lat1 * Math.PI / 180;
        var radLat2 = lat2 * Math.PI / 180;
        var deltaLat = radLat1 - radLat2;
        var deltaLng = long1 * Math.PI / 180 - long2 * Math.PI / 180;
        var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
        var length = parseInt(dis * 6378137);
        return length;
  },
  //百度经纬度转换腾讯经纬度的算法
Convert:function(lat, lng) {
  var x_pi = Math.PI * 3000.0 / 180.0;
  var x = lng - 0.0065, y = lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    lng = z * Math.cos(theta);
    lat = z * Math.sin(theta);
    var Convert = new Object();
    Convert.lng = lng;
    Convert.lat = lat;
    return Convert;     

  }

})