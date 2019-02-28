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
    startTime:"选择起始时间",
    endTime:"选择结束时间",
    dataList:[{}],
    showNoRecord:"none",
    checkIndex:0,//0:消费    1：积分
    OnlineAmtPoint:0,//目前可兑换积分 - 线上
    AmtPoint:0,//目前可兑换积分 - 线下
    OnlineAmtTotalPoint:0,//年度升级积分 - 线上
    AmtTotalPoint:0//年度升级积分 - 线下
  },
 
  onLoad: function (options) {//页面加载结束执行方法
    console.log();
    if (undefined !=options && undefined != options.console && options.console==1){
        this.setData({checkIndex:1});
      }
      this.queryServertime();
      this.queryData();
  },
  //绑定事件 - 消费
  bindCost:function(){
    this.setData({checkIndex:0});
  },
  //绑定事件 - 积分
  bindPoint:function(){
    this.setData({checkIndex:1});
  },
  //查询数据
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
  },
  queryDataFunc:function(){

      var that = this;
      if(wx.showLoading){
    	  wx.showLoading({title:""});
      }

      console.log(app.getHeader());

      wx.request({
          url: app.getUrl("GetSaleMast"),
          data: app.getData({dateS:that.data.startTime,dateE:that.data.endTime}),
          header: app.getHeader(),
          success: function(res) {
        	  if(wx.hideLoading){
        		  wx.hideLoading();
          	}
              if(res.data.Error==0){
                  
                    if(res.data.data.sale.length!=0){
                        that.setData({dataList:res.data.data.sale,showNoRecord:"none"});
                    }else{
                      that.setData({ dataList: [{}],showNoRecord:"block"});
                    }
              }
          }
      })
  },
  viewDetailFunc:function(e){
       wx.navigateTo({url:'/pages/a_grhy_xfqk_xx/a_grhy_xfqk_xx?comCode='+e.currentTarget.dataset.comcode+"&billDate="+e.currentTarget.dataset.billdate}  )
  },
  //查询服务器时间
  queryServertime:function(){
      var that = this;
      if(wx.showLoading){
    	  wx.showLoading({title:""});
      }
      wx.request({
          url: app.getUrl("getServertime"),
          data: app.getData({}),
          header: app.getHeader(),
          success: function(res) {
              if(wx.hideLoading){
            	  wx.hideLoading();
          	}
              var timeLong = res.data.servertime;
              that.setData({
                endTime:app.formatTime(new Date(timeLong),"yyyy-MM-dd"),
                startTime:app.formatTime(new Date(timeLong-24*60*60*1000),"yyyy-MM-dd")});
          }
      })
  },
  startTimeFunc:function(e){
      var startTime = new Date(e.detail.value).getTime();
      var endTime = new Date(this.data.endTime).getTime();
      if(startTime>endTime){
          wx.showToast({title: "起始时间不能大于结束时间",image:'../../images/error.png'});
      }else{
          this.setData({startTime:e.detail.value});
      }
  },
  endTimeFunc:function(e){
      var startTime = new Date(this.data.startTime).getTime();
      var endTime =  new Date(e.detail.value).getTime();
      if(startTime>endTime){
          wx.showToast({title: "起始时间不能大于结束时间",image:'../../images/error.png'});
      }else{
          this.setData({endTime:e.detail.value});
      }
  },
  //查询数据
  queryData:function(){
      var that = this;
      if(wx.showLoading){
    	  wx.showLoading({title:""});
      }
      wx.request({
          url: app.getUrl("fetchPoint"),
          data: app.getData({}),
          header: app.getHeader(),
          success: function(res) {
        	  if(wx.hideLoading){
        		  wx.hideLoading();
          	}
              if(res.data.Error==0){
                  var point = res.data.data.integral.AmtPoint + res.data.data.integral.OnlineAmtPoint;
                  that.setData({
                    OnlineAmtPoint:res.data.data.integral.OnlineAmtPoint,
                    AmtPoint:res.data.data.integral.AmtPoint,
                    OnlineAmtTotalPoint:res.data.data.integral.OnlineAmtTotalPoint,
                    AmtTotalPoint:res.data.data.integral.AmtTotalPoint
                  });
              }
          }
      })
  },
  
})

