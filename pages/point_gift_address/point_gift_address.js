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
		id:"",
		showAuthorizationBtnFlag:true,
		dataList:[],
		goods_album:[],
		do_title:"",
		point:""
	},
	//查询数据
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},
	onLoad: function (options) {//页面加载结束执行方法
		this.getDataDetail();
	},

	onShow:function(e){
		this.getDataDetail();
	},

	goToAddress: function (e) {
		wx.navigateTo({ url: '/pages/point_gift_address_add/point_gift_address_add' });
	},

	getDataDetail:function(){//获取list
		var that = this;
		wx.request({
			url: app.getUrl("getAddressList"),
			data: app.getData({}),
			header: app.getHeader(),
			success: function (res) {
				console.log("数据获取成功");
				console.log(res);
				if (res.data.Error == 0) {
					that.setData({
						dataList:res.data.data
					});
				}
			}
		})
	},
	//绑定时间 - 选择地址
	choiceAddress:function(e){
		var id = e.currentTarget.dataset.id;
		var name = e.currentTarget.dataset.name;
		var phone = e.currentTarget.dataset.phone;
		var area = e.currentTarget.dataset.area;
		let pages = getCurrentPages();//当前页面
		let prevPage = pages[pages.length-2];//上一页面
		prevPage.setData({
			id:id,
			name: name,
			phone: phone,
			area: area
		});
		wx.navigateBack({
			data:1
		});
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

