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
			path: '/pages/point_gift/point_gift'
		}
	},
	data: {
		showAuthorizationBtnFlag:true,
		dataList:[]
	},
	//查询数据
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},
	onLoad: function () {//页面加载结束执行方法
		var that = this;
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
			//用户按了允许授权按钮
			// wx.showModal({
			// 	content: "授权成功，第一次登陆请先修改个人信息",
			// 	showCancel: false,
			// 	confirmText: '知道了',
			// 	success: function (res) {
			// 		wx.switchTab({
			// 			url: '../my/my',
			// 		})
			// 	}
			// })
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
	getDataList:function(){//获取list
		var that = this;
		wx.request({
			url: app.getUrl("eshopList"),
			data: app.getData({}),
			header: app.getHeader(),
			success: function (res) {
				console.log("数据获取成功");
				console.log(res);
				if (res.data.Error == 0) {
					that.setData({"dataList":res.data.data});
				}
			}
		})
	},
	//绑定事件 - 跳转详情页
	bindGoToDetail: function (e) {
		var id = e.currentTarget.dataset.id;
		wx.navigateTo({ url: '/pages/point_gift_detail/point_gift_detail?id='+id})
	},

	initData: function () {
		var that = this;
		if(true){
			this.getDataList();
			return;
		}
		//判断用户是否登录
		if (app.isLogin()) {
			that.getDataList();
		} else {
			if (wx.showLoading) {
				// wx.showLoading({title:"努力加载中"});
			}
			app.appLogin(function (res) {
				if (wx.hideLoading) {
					wx.hideLoading();
				}
				if (res.data.Error == 0 && res.data.data.is_reg == 0) {//--- 写死数据
					that.setData({ nextType: 0 });
					wx.navigateTo({ url: '/pages/a_register/a_register' })
				} else if (res.data.Error == 0) {
					that.getDataList();
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

	getPhoneNumber: function (e) {
		console.log(e.detail.errMsg)
		console.log(e.detail.iv)
		console.log(e.detail.encryptedData)
	}
	

})

