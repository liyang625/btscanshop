/**常量 */

var constantArray = [
                        //验证码类型 
                        {key:"CHECKCODE_REG",value:"reg"},//注册
                        {key:"CHECKCODE_FORGET",value:"forget"},//忘记密码
                        {key:"CHECKCODE_LOGIN",value:"login"},//登录
                        {key:"CHECKCODE_OPENPAY",value:"openpay"},//开通支付
                        {key:"CHECKCODE_UNBIND",value:"unbind"},//解绑手机
                        {key:"CHECKCODE_BIND",value:"bind"},//绑定新手机
                        {key:"CHECKCODE_PAY",value:"pay"},//支付
                        {key:"CHECKCODE_FORGETPASS",value:"forgetpass"}//忘记密码第三步
                    ];

//获取常量公共方法
function getConstant(key){
  var returnvalue = "";
  for(var i=0;i<constantArray.length;i++){
    if(constantArray[i].key == key){
        returnvalue = constantArray[i].value;
    }
  }
  return returnvalue;
}


module.exports = {
  getConstant: getConstant
}