//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
var wxbarcode = require('../../utils/codemain.js');

var page = Page({
	/**分享 */
	onShareAppMessage: function () {
		return {
			title: '兴隆大院+',
			desc: '你想要的都在这里!',
			path: '/pages/point_my/point_my'
		}
	},
	data: {
		showAuthorizationBtnFlag:true,
		headerUrl:"",
		userName:"",
		points:""
	},
	//查询数据
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},
	onLoad: function () {//页面加载结束执行方法
		var that = this;
		wx.showShareMenu({
			withShareTicket: true,
		})
		wx.getSetting({
			success(res) {
				if (res.authSetting['scope.userInfo']){
					that.setData({"showAuthorizationBtnFlag":true});
					that.initData();	
				}else{
					that.setData({ "showAuthorizationBtnFlag": false });	
				}
			}
		})
	},
	onGotUserInfo: function (e) {//授权用户信息回调
		var that = this;
		console.log(e.detail.userInfo)
		if (e.detail.userInfo) {
			that.setData({ "showAuthorizationBtnFlag": true });	
			that.initData();
		} else {
			that.setData({ "showAuthorizationBtnFlag": false });	
			wx.showModal({
				content: "您已拒绝授权",
				showCancel: false,
				confirmText: '知道了',
				success: function (res) {
					that.setData({
						showModal2: false
					});
				}
			})
		}
	},
	initData:function(){

		var that = this;
		//判断用户是否登录
		if (app.isLogin()) {
			that.getUserInfo();
		} else {
			if (wx.showLoading) {
				wx.showLoading({title:"努力加载中"});
			}
			app.appLogin(function (res) {
				if (wx.hideLoading) {
					wx.hideLoading();
				}
				
				if (res.data.Error == 0 && res.data.data.is_reg == 0) {//--- 写死数据
					that.setData({ nextType: 0 });
					wx.navigateTo({ url: '/pages/a_register/a_register' })
				} else if (res.data.Error == 0) {
					that.getUserInfo();
				} else {
					wx.showToast({ title: res.data.Msg, image: '../../images/error.png' });
				}
			});
		}
	},
	onShow: function (e) {//当前页面重新显示
		var that = this;
		if (that.data.nextType == 0) {
			if (app.isLogin()) {
				that.initData();
			} else {
				that.setData({ showMain: "none", showRegist: "block" });
			}
			that.setData({ nextType: -1 });
		}
	},

	getUserInfo:function(e){
		var that = this;
		app.getUserInfoDetail(function (res) {
			that.setData({
				headerUrl: res.data.user.headimg,
				userName: res.data.user.nickname,
				points: res.data.point
			});
		});

	},
	getPhoneNumber: function (e) {
		console.log(e.detail.errMsg)
		console.log(e.detail.iv)
		console.log(e.detail.encryptedData)
	},
	onShareAppMessage:function(res){//分享调用

		var _this = this;
		console.log(res);
		if (res.from === 'button') {
			// 来自页面内转发按钮
			_this.data.shareBtn = true;
		} else {
			//来自右上角转发
			_this.data.shareBtn = false;
		}
		return {
			title: '自定义转发标题',
			path: 'pages/index/index',
			complete: function (res) {
				
				console.log(res);
				if (res.errMsg == 'shareAppMessage:ok') {
					//分享为按钮转发
					if (_this.data.shareBtn) {
						//判断是否分享到群
						if (res.hasOwnProperty('shareTickets')) {
							console.log(res.shareTickets[0]);
							//分享到群
							_this.data.isshare = 1;
							wx.showToast({
								title: 'qun',
							});
						} else {
							// 分享到个人
							_this.data.isshare = 0;
							wx.showToast({
								title: 'geren',
							});
						}
					}
				} else {
					wx.showToast({
						title: '分享失败',
					})
					_this.data.isshare = 0;
				}
			},
		}

		
	}

})

