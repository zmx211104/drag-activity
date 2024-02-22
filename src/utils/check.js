export function limitTelInputOnlyNumber(elId, maxLength) {
  console.log("------------");
  var telInputElement = jQuery("#" + elId);
  telInputElement.keyup(function (event) {
    var cursorPosition = getCursorPosition(elId);
    this.value = this.value.replace(/[^\d]/g, ""); //清除“数字”以外的字符
    if (maxLength && this.value.length > maxLength) {
      this.value = this.value.slice(0, maxLength).toString();
    }
    setCaretPosition(jQuery(this)[0], cursorPosition);
  });
}
//金额转大写
export function formatMoneyToCapital(money) { 
  var fraction = ["角", "分"];
  var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  var unit = [
    ["元", "万", "亿"],
    ["", "拾", "佰", "仟"],
  ];
  var head = money < 0 ? "负" : "";
  var n = Math.abs(money);
  var s = "";
  for (var i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
    ).replace(/零./, "");
  }
  s = s || "整";
  n = Math.floor(n);
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = "";
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, "元")
      .replace(/(零.)+/g, "零")
      .replace(/^整$/, "零元整")
  );
}

// 校验手机号
export function isMobile(s) {
  return new RegExp("^1[3456789]\\d{9}$").test(s);
}
export function moneyIsEmptyOrError(money) {
  if (!money) {
    return true;
  }
  if (
    (money.substr(0, 1) == "0" && money.substr(1, 1) != ".") ||
    parseFloat(money) <= 0.0
  ) {
    return true;
  }
  var moneyReg = new RegExp(/^[0-9]*\.?[0-9]{0,2}$/);
  if (!moneyReg.test(money)) {
    return true;
  }
  return false;
}

  export function formatRate(rate){
		var rs = (+rate).toString();
		if (rs.indexOf('.') == -1) {
			return rs+'.00';
		} else {
			var a = rs.split('.').pop();
			if(a.length == 1){
				rs+='0';
			}
		}
		return rs;
	}
  export function foramtMoneyToWan(money){
    if (money < 10000) {
			return money + "元";
		} else {
			return money / 10000 + "万";
		}
  }
  export function formatStartEndDate(str, type) {
		var date_array = str.split("-");
		if (date_array.length == 2) {
			var start = getFormateDate(date_array[0]);
			var end = getFormateDate(date_array[1]);
			if (type == 0) { //开始日期
				return start;
			} else if (type == 1) { //结束日期
				return end;
			}
			return start + '-' + end;
		}
		return "-";
	}

export function getFormateDate(str_d) {
		if (str_d.length != 8) {
			return str_d;
		}
		if (str_d == '99999999') {
			return '   ~';
		}
		return str_d.substr(0, 4) + "年" + parseInt(str_d.substr(4, 2)) + "月" + parseInt(str_d.substr(6, 2)) + "日";
	}
  export function dataToDate (value) {
		var flag = "";
		if (value != null || value != "") {
			if (value.length >= 8) {
				var yyyy = value.substring(0, 4);
				var mm = value.substring(4, 6);
				var dd = value.substring(6, 8);
				flag = yyyy + "-" + mm + "-" + dd;
			} else if (value.length == 6) {
				var yyyy = value.substring(0, 4);
				var mm = value.substring(4, 6);
				flag = yyyy + "-" + mm;
			}
		}
		return flag;
	}
  export function ignoreChar (string,char) {
		var temp = "";
		string = '' + string;
		var splitstring = string.split(char);
		for(i = 0; i < splitstring.length; i++)
		temp += splitstring[i];
		return temp;
	}
  export function checkYearsOld(params) {
		if(!params){
			params = {};
		}
		if(!params.certNo){
			params.certNo = localStorage.getItem("session_certNo");
		}
		if(!params.certType && params.certType !== 0){
			params.certType = localStorage.getItem("session_certType");
		}
		if(!params.certNo || params.certNo == "null" || params.certNo == "undefined"){
			if(typeof params.noCertNo == 'function'){
				params.noCertNo();
			}else if(typeof params.success == 'function'){
				exports.alert("证件号码不能为空");
			}
			return;
		}
		//params.certType = "1"
		exports.apiSend('post', exports.getApiURL() + 'getSysTime.do', {}, function(data) {
			var day = data.sysDate;
			//day = "20030624"
			if(params.certType == "0"){//身份证
				var certNo = params.certNo; 
				if(certNo.length >= 15){
					doCheck(day,certNo);
				}else{
					doFailAgeCallBack("证件号码不正确");
				}
			}else{
				//params.certType = "0"
				exports.apiSend('post',exports.getApiURL() + 'queryCustInfoAction.do', {
					currentBusinessCode:"99900194",
					certType:params.certType,
					certNo:params.certNo,
				}, function(d){
					if(!d.birthDay || d.birthDay == "00000000" || d.birthDay == "null" || d.birthDay == "undefined"){
						doFailAgeCallBack();
					}else{
						var birthDay = d.birthDay;
						doCheck(day,"000000"+birthDay+"0000");
					}
				},function(e){
					doFailAgeCallBack();
				});
			}
		}, true);
		function doCheck(day,certNo){
			if(checkYounger16(day,certNo)){
				doFail16CallBack();
			}else if(checkYounger18(day,certNo)){
				doFail18CallBack();
			}else{
				doSuccessCallBack();
			}
		}
		function checkYounger18(today,IdNo){
			return checkYounger(18,today,IdNo);
		}
		function checkYounger16(today,IdNo){
			return checkYounger(16,today,IdNo);
		}
		function checkYounger(age,today,IdNo){
			try{
				//console.log("~~~~~~~~~~~~~~"+IdNo)
				var bornYear = IdNo.substring(6,10);
				var bornMD = IdNo.substring(10,14);
				var eightYearsOld = (parseInt(bornYear)+parseInt(age)).toString()+bornMD;
				if(parseInt(eightYearsOld) > parseInt(today)){
					return true
				}else{
					return false
				}
			}catch (e){
				doFailAgeCallBack();
			}
			return false
		}
		function doSuccessCallBack(){
			if(typeof params.success == 'function'){
				params.success();
			}
		}
		var fail18defaultMsg = "为降低青少年的电信诈骗风险，保障青少年资金安全，请到遂宁银行网点签约电子银行业务后使用。服务电话96677！未成年人须监护人陪同。";
		var fail16defaultMsg = "为降低青少年的电信诈骗风险，保障青少年资金安全，您暂不能使用电子银行转账功能。";
		function doFail18CallBack(){
			if(typeof params.fail18 == 'function'){
				params.fail18(fail18defaultMsg);
			}else if(typeof params.success == 'function'){
				params.success();
			}
		}
		function doFail16CallBack(){
			if(typeof params.fail16 == 'function'){
				params.fail16(fail16defaultMsg);
			}else if(typeof params.fail18 == 'function'){
				params.fail18(fail18defaultMsg);
			}else if(typeof params.success == 'function'){
				params.success();
			}
		}
		function doFailAgeCallBack(msg){
			var message = msg || "客户信息查询失败，请确认您的个人信息是否完整。";
			if(typeof params.failAge == 'function'){
				params.failAge(message);
			}else if(typeof params.success == 'function'){
				exports.alert(message);
			}
		}
	}
  let regObj = {
	REGEXP_MONEY : new RegExp(/^[0-9]*\.?[0-9]{0,2}$/),
}
  export function isMoney (s) {
		 return ( regObj.REGEXP_MONEY.test(s) );
	}
