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
		point:"",
		goodsdata:null
	},
	//查询数据
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},
	onLoad: function (options) {//页面加载结束执行方法
		var id = options.id;
		// var id = 21547;
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
		var id = this.data.id;
		var that = this;
		wx.request({
			url: app.getUrl("eshopShow")+id,
			data: app.getData({}),
			header: app.getHeader(),
			success: function (res) {
				if (res.data.Error == 0) {
					var obj = res.data.data[id];
					var goods_album = [];
					for (var i = 0; i < obj.goods_album.length;i++){
						goods_album[i] = obj.goods_album[i].thumb
					}
					that.setData({ "goods_album": goods_album,
												 "do_title":obj.do_title,
												 "point": obj.point_price,
												 "goodsdata":obj});
					
					/**
					* WxParse.wxParse(bindName , type, data, target,imagePadding)
					* 1.bindName绑定的数据名(必填)
					* 2.type可以为html或者md(必填)
					* 3.data为传入的具体数据(必填)
					* 4.target为Page对象,一般为this(必填)
					* 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
					*/
					WxParse.wxParse('article', 'html', obj.content, that, 5);
				}
			}
		})
	},
	submit:function(e){//立即兑换
		var param = {
			"goods_id":this.data.id,//商品id
			"number":"1",//商品数量
			"type": "1",//0：加入购物车 1：立即购买
			"mode":"1",// 1：配送 2：自提
			"deliveryID": this.data.goodsdata.send_outlet_id
		};

		console.log("提交订单参数");
		console.log(param);
		console.log("提交订单");

		wx.request({
			url: app.getUrl("cartAdd"),
			data: app.getData(param),
			header: app.getHeader(),
			success: function (res) {
				console.log("提交订单成功");
				console.log(res);
				if (res.data.Error == 0) {

					var cardid = res.data.id;
					var mode = param["mode"];
					var deliveryID = param["deliveryID"];
					var type = "goodsdetail";
					var goodsid = param["goods_id"];

					wx.navigateTo({ url: '/pages/point_gift_order/point_gift_order?cardid=' + cardid + 
																																				'&mode=' + mode + 
																																				'&deliveryID=' + deliveryID + 
																																				'&type=' + type + 
																																				'&goodsid=' + goodsid})
				}
			}
		})
	},
	getPhoneNumber: function (e) {
		console.log(e.detail.errMsg)
		console.log(e.detail.iv)
		console.log(e.detail.encryptedData)
	}

})

