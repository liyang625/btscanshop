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
      dataList:[{}]
  },
 
  onLoad: function (e) {//页面加载结束执行方法
      this.queryDataFunc(e.comCode,e.billDate);
  },
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
  },
  //查看详情
  viewDetailFunc:function(e){
      var that = this;
        var billid = e.currentTarget.dataset.billid;
        var dataList = this.data.dataList;
        for(var i=0;i<dataList.length;i++){
            for(var j=0;j<dataList[i].detail.length;j++){
                if(dataList[i].detail[j].billId==billid){
                    if(dataList[i].detail[j]["showFlag"]){
                        dataList[i].detail[j]["showFlag"] = false;
                    }else{
                        dataList[i].detail[j]["showFlag"] = true;
                    }
                    that.setData({dataList:dataList});
                    break;
                }
            }
        }
  },
  //查询数据
  queryDataFunc:function(comCode,date){
    
      var that = this;
      if(wx.showLoading){
    	  wx.showLoading({title:""});
      }
      wx.request({
          url: app.getUrl("GetSaleMastDetail"),
          data: app.getData({comCode:comCode,date:date}),
          header: app.getHeader(),
          success: function(res) {
        	  if(wx.hideLoading){
        		  wx.hideLoading();
          		}
              if(res.data.Error==0){
                  var dataList = res.data.data.sale;
                  for(var i=0;i<dataList.length;i++){
                    for(var j=0;j<dataList[i].detail.length;j++){
                        dataList[i].detail[j]["showFlag"] = false;
                        dataList[i].detail[j]["billId"] = dataList[i].detail[j]["billId"]+j;
                    }
                  }
                  that.setData({dataList:dataList});
              }
          }
      })
  }
})

