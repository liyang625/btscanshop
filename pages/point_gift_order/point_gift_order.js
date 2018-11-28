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
		expressIndex:0,
		selectOutletNowArrIndex:0,
		message_to_seller:"可以输入留言了"
	},
	//查询数据
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},
	onLoad: function (options) {//页面加载结束执行方法
		this.setData({
			"cardid": options.cardid,
			"mode": options.mode,
			"deliveryID": options.deliveryID,
			"type": options.type,
			"goodsid": options.goodsid});
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
		
		var cardid = this.data.cardid;
		var that = this;
		var param = {};
		param["cart_id[" + cardid + "]"] = cardid;

		wx.request({
			url: app.getUrl("combineInfo"),
			data: app.getData(param),
			header: app.getHeader(),
			success: function (res) {
				console.log("数据购物车获取成功");
				console.log(res);
				var resultData = res.data.data;
				if (res.data.Error == 0) {
					//初始化地址
					if (null != resultData.selfAddress && "" != resultData.selfAddress && undefined != resultData.selfAddress.id){
							that.setData({
								"userAddressId": resultData.selfAddress.id,
								"userName": resultData.selfAddress.name,
								"userPhone": resultData.selfAddress.phone,
								"userAddress": resultData.selfAddress.area
							});
					};

					//初始化商品
					var goodsList = [];
					var goodsListIndex = 0;
					Object.keys(resultData.goods).forEach(function (key) {
						goodsList[goodsListIndex] = resultData.goods[key];
						goodsList[goodsListIndex]["goodsid"] = key;
						goodsListIndex++;
					});
					for (var i = 0; i < goodsList.length;i++){
						for (var j = 0; j < goodsList[i].good.length;j++){
							  var orderGoodsData = goodsList[i].good[j];
								that.setData({
									"goodsId": goodsList[i].goodsid,
									"goodsName": orderGoodsData.do_title,
									"points": orderGoodsData.point_price,
									"thumb": orderGoodsData.thumb
								});
						}
					}

					//初始化配送方式
					var expressList = [];
					var expressListIndex = 0;
					Object.keys(goodsList[0].express).forEach(function (key) {
						expressList[expressListIndex] = goodsList[0].express[key];
						expressListIndex++;
					});
					that.setData({
						"expressList": expressList,
						"expressId": expressList[0].express_id,
						"expressName": expressList[0].express_name,
						"express_price": expressList[0].do_express_price
					});

					//售后门店
					var selectOutletNowArrList = [];
					var selectOutletNowArrListIndex = 0;
					Object.keys(goodsList[0].selectOutletNowArr).forEach(function (key) {
						selectOutletNowArrList[selectOutletNowArrListIndex] = goodsList[0].selectOutletNowArr[key];
						selectOutletNowArrListIndex++;
					});
					that.setData({
						"selectOutletNowArrList": selectOutletNowArrList,
						"selectOutletNowArrId": selectOutletNowArrList[0].id,
						"selectOutletNowArrName": selectOutletNowArrList[0].title
					});
				}
			}
		})
	},
	onShow:function(){
			var that = this;
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1];
			if(currPage.data.id){
				that.setData({
					"userAddressId": currPage.data.id,
					"userName": currPage.data.name,
					"userPhone": currPage.data.phone,
					"userAddress": currPage.data.area
				});
			}
	},
	//配送方式
	bindPickerChange: function(e) {
			this.setData({
				expressIndex: e.detail.value,
				expressId: this.data.expressList[e.detail.value]
			})
	},
	//售后门店
	bindPickerChange1: function (e) {
		this.setData({
			selectOutletNowArrIndex: e.detail.value,
			selectOutletNowArrId: this.data.selectOutletNowArrList[e.detail.value]
		})
	},
	//绑定事件 - 跳转详情页
	bindGoToDetail: function (e) {
		var id = e.currentTarget.dataset.id;
		
	},
	//提交
	submit:function(e){
		var that = this;
		if (undefined == this.data.userAddressId || null == this.data.userAddressId || "" == this.data.userAddressId){
			wx.showToast({ title: "请选择收货地址", image: '../../images/error.png' });
			return;
		}
			var param = {
				"is_preferential":0,// 0:普通商品    1：优惠买单
				"is_point":1,//0：不使用积分   1：使用积分
				"point_price": this.data.points,//销售积分
				"getExid": this.data.userAddressId,//收货地址id
				"addressEditId": this.data.userAddressId//收货地址id
			};
			param["Freight[" + this.data.goodsId + "][0]"] = 1;//运送方式  1:配送 2：自提
			param["Freight[" + this.data.goodsId + "][1]"] = this.data.expressId;//配送方式
			param["jinli_outletId["+this.data.goodsId +"]"] = this.data.selectOutletNowArrId;//售后门店
			// param["message_to_seller[" + this.data.goodsId + "]"] = this.data.message_to_seller;//留言
			param["cart_id[" + this.data.goodsId + "]"] = this.data.cardid;//购物车id

		
			console.log("提交订单参数");
			console.log(param);

		wx.request({
			url: app.getUrl("combineCreate"),
			data: app.getData(param),
			header: app.getHeader(),
			success: function (res) {
				console.log("提交订单成功");
				console.log(res);
				if (res.data.Error == 0) {
					var ids = "";
					if (null != res.data.orderids) {
						for (var i=0; i < res.data.orderids.length;i++) {
							ids += res.data.orderids[i] + ",";
						}
					}
					if(ids.length > 0){
							ids = ids.substring(0, ids.length - 1);					
					}

					wx.navigateTo({
						url: '/pages/point_gift_order_pay/point_gift_order_pay'+
									'?express_price=' + that.data.express_price + 
									"&id=" + ids +
									"&paytype=eshop"
					});
				}else{
					wx.showToast({ title: res.data.Msg, image: '../../images/error.png' });
				}
			}
		})
	},
	goToAddress:function(e){
		wx.navigateTo({ url: '/pages/point_gift_address/point_gift_address'});
	},
	getPhoneNumber: function (e) {
		console.log(e.detail.errMsg)
		console.log(e.detail.iv)
		console.log(e.detail.encryptedData)
	}
	
	
})

