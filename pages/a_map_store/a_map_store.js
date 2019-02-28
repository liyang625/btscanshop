// pages/a_map_store/a_map_store.js
var app = getApp()
Page({
  /**分享 */
  onShareAppMessage: function () {
    return {
      title: '兴隆大院+',
      desc: '你想要的都在这里!',
      path: '/pages/a_my/a_my'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    imgurl:"",
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userInfo: {}
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
      var that = this;
      var markerId = query.markerId; 
      wx.request({
        url: app.getUrl("wxGetStoreMap"),
        data: app.getData({"id":markerId}),
        header: app.getHeader(),
        success: function (res) {
          let lng = app.Convert(res.data.data[0].map_lat, res.data.data[0].map_lng).lng;
          let lat = app.Convert(res.data.data[0].map_lat, res.data.data[0].map_lng).lat;
          if(null!=res.data.data[0].phone){
            res.data.data[0]["rphone"] = res.data.data[0].phone.replace(/-/g,"");
            res.data.data[0]["rphone"] = res.data.data[0].rphone.replace(/ /g,"");
          }
          that.setData({
            data: res.data.data[0],
            latitude: lat,
            longitude:lng
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  //绑定事件 - 拨打电话
  bindCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  //绑定事件 
  bindGo: function (e) {
    wx.openLocation({
      latitude: e.target.dataset.latitude,
      longitude: e.target.dataset.longitude,
      scale: 16
    })
  }
})