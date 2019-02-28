var app = getApp();  
Page({
  /**分享 */
  onShareAppMessage: function () {
    return {
      title: '兴隆大院+',
      desc: '你想要的都在这里!',
      path: '/pages/a_my/a_my'
    }
  },
  data: {
    Height: 0,
    scale: 15,
    latitude: "",
    longitude: "",
    markers: [],
    controls: [{
      id: 1,
      iconPath: '../../images/jian.png',
      position: {
        left: 300,
        top: 100 - 50,
        width: 30,
        height: 30
      },
      clickable: true
    },
    {
      id: 2,
      iconPath: '../../images/jia.png',
      position: {
        left: 330,
        top: 100 - 50,
        width: 30,
        height: 30
      },
      clickable: true
      },
      {
        id:3,
        iconPath: '../../images/dw.png',
        position: {
          left: 270,
          top: 100 - 50,
          width: 30,
          height: 30
        },
        clickable: true
      }
    ],
    circles: []

  },
  onLoad: function () {
    var _this = this;

    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        _this.setData({
          view: {
            Height: res.windowHeight
          }
        })
      }
    })
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        let latitude = res.latitude;
        let longitude = res.longitude;
        let marker = this.createMarker(res);
        this.setData({
          centerX: longitude,
          centerY: latitude
        });
        _this.getSchoolMarkers();
      },
      fail: function () {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法正常使用兴隆大院的功能体验。是否立即授权？',
          success: function (res) {
            if (res.confirm) {
              if(!wx.openSetting){
            	  wx.showToast({title: '微信版本太低，无法授权，请升级版本'});
            	  return;
              }
              wx.openSetting({
                success: function (data) {
                  if (data && data.authSetting["scope.userLocation"] == true) {
                      wx.getLocation({
                        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
                        success: (res) => {
                          let latitude = res.latitude;
                          let longitude = res.longitude;
                          let marker = _this.createMarker(res);
                          _this.setData({
                            centerX: longitude,
                            centerY: latitude
                          })
                          _this.getSchoolMarkers();
                        }
                      });
                  }
                },
                fail: function () {
                  console.info("设置失败返回数据");
                }
              });
            }
          }
        })
      }
    });
    
  },
  onShow:function(e){
    var markers = this.data.markers;
    //this.setData({markers:[]});
    this.setData({markers: markers});
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('map')
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  regionchange(e) {
  },

  //点击merkers
  markertap(e) {
    wx.navigateTo({
    url:'/pages/a_map_store/a_map_store?markerId='+e.markerId
    })
  },

  //点击缩放按钮动态请求数据
  controltap(e) {
    var that = this;
    if (e.controlId === 1) {
      that.setData({
        scale: --this.data.scale
      })
    } else if (e.controlId === 2) {
      that.setData({
        scale: ++this.data.scale
      })
    } else {
      that.moveToLocation()
    }
  },
  getSchoolMarkers: function () {
    var that = this;
    let markers = [];
    wx.request({
      url: app.getUrl("wxGetStoreMap"),
      header: app.getHeader(),
      success: function (res) {
        for (let item of res.data.data) {
          let marker = that.createMarker(item);
          markers.push(marker)
        }
        that.setData({
          markers: markers
        })
      }
    })
  },
  createMarker(point) {
    let latitude = point.map_lat;
    let longitude = point.map_lng;
    //百度经纬度转换为腾讯经纬度
    let lng = app.Convert(latitude, longitude).lng ;
    let lat = app.Convert(latitude, longitude).lat;
    let marker = {
      iconPath: "../../images/position.png",
      id: point.id || 0,
      name: point.title || '',
      latitude: lat,
      longitude: lng,
      width: 30,
      height: 36
    };
    return marker;
  },
  onShareAppMessage: function () {
    return {
      title: '兴隆大院',
      desc: '兴隆大院小程序!',
      path: '/pages/a_map/a_map',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
        })
      }
    }
  }

})