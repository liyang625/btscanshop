//正式库
var BASE_URL = "https://api.one-stop.xinglongdayuan.com/ol/";
//测试库
// var BASE_URL = "https://api.one-stop.xlgoo.net/ol/";
//首页导航
var requestArray = [
        {key:"getShopNavForFlex",url:"eshop/getShopNavForFlex/DJEHBSUAAY"},//获取导航区域
        {key:"Code2login", url: "xl_login/wxCode2login/DJEHBSUAAY" },//登录
        {key:"sendPhoneCode", url:"send_sms/sendPhoneCode/DJEHBSUAAY"},//发送验证码
        {key:"xlReg", url:"xl_reg/Reg/DJEHBSUAAY"},//注册
        { key: "getFamilyInfoByVip", url:"family/getFamilyInfoByVip/DJEHBSUAAY"},//获取家庭会员
        {key:"getServertime",url:"xlapp/getServertime/DJEHBSUAAY"},//获取服务器时间
        {key:"fetchPoint",url:"xlapp/fetchPoint/DJEHBSUAAY"},//获取会员积分
        {key:"checkOpenPay", url: "xlapp/fetchMemberInfo/DJEHBSUAAY" },//检查是否开通钱包
        {key:"XlkRegister", url:"xl_balance/open/DJEHBSUAAY"},//开通钱包
        {key:"bind", url: "xl_balance/bind/DJEHBSUAAY" },//绑定钱包
        {key:"GetSaleMast",url:"xlapp/GetSaleMast/DJEHBSUAAY"},//消费记录
        {key:"GetSaleMastDetail",url:"xlapp/GetSaleMastDetail/DJEHBSUAAY"},//消费记录详情
        {key:"getMathCode",url:"xlapp/getMathCode/DJEHBSUAAY"},//校验验证码
        {key:"GetComList",url:"xlmembercard/GetComList/DJEHBSUAAY"},//获取常去门店列表
        {key:"fetchMemberInfo",url:"xlclerk/fetchMemberInfo/DJEHBSUAAY"},//获取会员详细信息
        {key:"updateCard",url:"xlapp/updateCard/DJEHBSUAAY"},//修改常去门店
        {key:"wxGetStoreMap", url: "xlapp/wxGetStoreMap/DJEHBSUAAY" },//请求门店经纬度
        {key:"createFamily", url: "family/createFamily/DJEHBSUAAY" },//创建家庭
        { key: "GetMastRelList", url: "family/getFamilyRel/DJEHBSUAAY" },//获得与户主关系列表
        { key: "getVipInfoAndFamilyRoleByPapernoCardno", url: "family/getVipInfoAndFamilyRoleByPapernoCardno/DJEHBSUAAY" },//跟据卡号和身份证号查询会员信息与家庭角色
        {key:"sendInvitation", url: "family/sendFamily/DJEHBSUAAY" },//邀请/申请家庭会员
        {key:"familyRemMem", url: "family/RemFamily/DJEHBSUAAY" },//户主移除会员/会员退出家庭
        {key:"MyCoupon", url: "member_coupon/MyCoupon/DJEHBSUAAY" },//卡券包
        {key:"xlApplyDealBarcode", url: "xlapp/xlApplyDealBarcode/DJEHBSUAAY" },//付款码
        {key:"coupon_log_details", url: "coupon/coupon_log_details/DJEHBSUAAY" },//卡券包
        {key:"wxDecipher", url: "/xlapp/wxDecipher//DJEHBSUAAY" },//微信运动解密
        {key:"xxxx",url:"xxxx"},

				{key: "eshopList", url: "eshop_list/eshop_list/DJEHBSUAAY?request_type=wxapp" },//积分礼品列表
				{ key: "eshopShow", url: "eshop_show/eshop_show/DJEHBSUAAY?id=" },//获取礼品详情信息
				{ key: "getAllRegion", url: "address/getAllRegion/DJEHBSUAAY" },//获取所有区域
				{ key: "cartAdd", url: "cart/cart_add/DJEHBSUAAY?id=" },//加入购物车
				{ key: "combineInfo", url: "order/combine_info/DJEHBSUAAY" },//加入购物车
				{ key: "combineCreate", url: "order/combine_create/DJEHBSUAAY" },//提交订单
				{ key: "addpayorder", url: "pay/addpayorder/DJEHBSUAAY" },//获取商品预支付id
				{ key: "sign", url: "wxapp_pointpay/sign/DJEHBSUAAY" },//获取微信支付签名
				{ key: "getAddressList", url: "address/getAddressList/DJEHBSUAAY" },//获取收货地址列表
				{ key: "getAllRegion", url: "address/getAllRegion/DJEHBSUAAY" },//获取城市信息
        ];

//正式库
var BASE_URL_VIP_SHOP = "https://api.one-stop.xinglongdayuan.com/vip-shop-service/";
//
var requestVipShopArray = [
  { key: "createTrade", url: "shop/pay/ScanpayController/createTrade" },//创建交易订单
  { key: "pay", url: "shop/pay/ScanpayController/pay" },//支付
  { key: "queryPayInfo", url: "shop/pay/ScanpayController/queryPayInfo" },//检查支付结果
];

//获取url公共方法
function getUrl(key){
  var returnurl = "";
  for(var i=0;i<requestArray.length;i++){
    if(requestArray[i].key == key){
        returnurl = BASE_URL+requestArray[i].url;
    }
  }
  return returnurl;
}

//获取url公共方法
function getUrlVipShop(key) {
  var returnurl = "";
  for (var i = 0; i < requestVipShopArray.length; i++) {
    if (requestVipShopArray[i].key == key) {
      returnurl = BASE_URL_VIP_SHOP + requestVipShopArray[i].url;
    }
  }
  return returnurl;
}













function formatTime(date) {
  if(!date){
    date = new Date();
  }

  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatDistance(distance) {
  distance = +distance;
  return distance < 1000 ? Math.round(distance) + 'm' : (distance/1000).toFixed(1) + 'km';
}

function isPlainObject(obj) {
  for (var name in obj) {
    return false;
  }
  return true;
}

function isPhoneNumber(num) {
  return /^1\d{10}$/.test(num);
}

module.exports = {
  formatTime: formatTime,
  isPlainObject: isPlainObject,
  isPhoneNumber: isPhoneNumber,
  formatDistance: formatDistance,
  getUrl:getUrl,
  getUrlVipShop: getUrlVipShop
}


