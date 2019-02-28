//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
var wxbarcode = require('../../utils/codemain.js');
var WxParse = require('../../wxParse/wxParse.js');

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
		dataList: [],
		allDataList:[],
		dataIndex:0,
		inputAreaDesc:"",
		choiceAreaDesc:"",
		areaChoiceIndex:0,// 0：省   1：市    2：区县   3：镇
		province:"",
		city: "",
		district: "",
		ring: "",
		choiceShow:false
	},
	//查询数据
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},
	onLoad: function (options) {//页面加载结束执行方法
		var id = options.id;
		this.setData({"id":id});
		var that = this;
		wx.getSetting({
			success(res) {
				if (res.authSetting['scope.userInfo']){
					that.setData({"showAuthorizationBtnFlag":true});	
					that.getDataDetail();
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
			that.getDataDetail();
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
	getDataDetail:function(){//获取list
		var that = this;
		if (wx.showLoading) {
			wx.showLoading({ title: "获取城市地址中" });
		}
		wx.request({
			url: app.getUrl("getAllRegion"),
			data: app.getData({}),
			header: app.getHeader(),
			success: function (res) {
				console.log("数据获取成功");
				console.log(res);
				wx.hideLoading();
				if (res.data.Error == 0) {
					that.setData({
						"dataList":res.data.data,
						"allDataList": res.data.data
					});
				}
			}
		})
	},
	bindPickerClick:function(e){
			console.log("点击了");
			this.setData({
				dataList: this.data.allDataList,
				areaChoiceIndex:0,
				choiceAreaDesc:"",
				province1: "",
				city1: "",
				district1: "",
				ring1: "",
				choiceShow:true
			});
	},
	//点击选择城市
	bindChoice:function(e){

		var index = e.currentTarget.dataset.index;
		var value = e.currentTarget.dataset.value;
		var name = e.currentTarget.dataset.name;
		if (this.data.areaChoiceIndex==0){//省

			this.setData({
				dataList: this.data.dataList[index].children,
				areaChoiceIndex: 0,
				choiceAreaDesc: name,
				province1: value,
				areaChoiceIndex:1
			});
		} else if (this.data.areaChoiceIndex == 1) {//市
			this.setData({
				dataList: this.data.dataList[index].children,
				areaChoiceIndex: 0,
				choiceAreaDesc: this.data.choiceAreaDesc + " " + name,
				city1: value,
				areaChoiceIndex: 2
			});
			
		} else if (this.data.areaChoiceIndex == 2) {//区县
			if (null != this.data.dataList[index].children) {
				this.setData({
					dataList: this.data.dataList[index].children,
					areaChoiceIndex: 0,
					choiceAreaDesc: this.data.choiceAreaDesc + " " + name,
					district1: value,
					areaChoiceIndex: 3
				});
			}else{
				this.setData({
					inputAreaDesc: this.data.choiceAreaDesc + " " + name,
					province: this.data.province1,
					city: this.data.city1,
					district: value,
					choiceShow: false
				});
			}
		} else if (this.data.areaChoiceIndex == 3) {//镇
			this.setData({
				inputAreaDesc: this.data.choiceAreaDesc + " " + name,
				province: this.data.province1,
				city: this.data.city1,
				district: this.data.district1,
				ring:value,
				choiceShow: false
			});
		}
	},
	bindCancle:function(e){
		this.setData({
			choiceShow: false
		});
	},
	//省市区县镇
	bindPickerChange1: function (e) {
		this.setData({
			dataIndex: e.detail.value
		})
	},
	//绑定事件 - 跳转详情页
	bindGoToDetail: function (e) {
		var id = e.currentTarget.dataset.id;
		
	},
	getPhoneNumber: function (e) {
		console.log(e.detail.errMsg)
		console.log(e.detail.iv)
		console.log(e.detail.encryptedData)
	}
	
	
})

