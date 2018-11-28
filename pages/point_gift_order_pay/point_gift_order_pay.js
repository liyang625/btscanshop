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
		this.setData({ 
			"express_price": options.express_price,
			"id": options.id,
			"paytype": options.paytype
		});
	},
	pay:function(){
		var that = this;
		var param = {
			"id":this.data.id,
			"referrerType": this.data.paytype
		};

		wx.request({
			url: app.getUrl("addpayorder"),
			data: app.getData(param),
			header: app.getHeader(),
			success: function (res) {
				console.log("获取预支付id成功");
				console.log(res);
				
				if (res.data.Error == 0) {
					
					//获取签名
					var param1 = {"payid":res.data.payid};
					wx.request({
						url: app.getUrl("sign"),
						data: app.getData(param1),
						header: app.getHeader(),
						success: function (res) {
							console.log("获取签名成功");
							console.log(res);
							if (res.data.Error == 0) {
								wx.requestPayment({
                  timeStamp: res.data.data.appParameters.timestamp,
                  nonceStr: res.data.data.appParameters.noncestr,
                  package: res.data.data.appParameters.prepayid,
									signType: 'MD5',
                  paySign: res.data.data.appParameters.paySign,
									success(res) { 
										wx.showToast({ title: "支付成功", image: '../../images/error.png' });
									},
									fail(res) { 
                    console.log(res);
										wx.showToast({ title: "支付失败", image: '../../images/error.png' });
									}
								})
							}
						}
					})

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

