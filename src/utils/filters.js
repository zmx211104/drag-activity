import dictData from '@/config/dict.config.js'
/**
 * 金额格式化，千分位
 * @param {*} value
 * @param {*} unit 单位 10000=> 1万
 */
const moneyFormat = (value, type = true, unit) => {
  let val = Number(value);
  if (!isNaN(val)) {
    let s = val.toString().split(".");
    let decimal = s[1] && s[1].length < 2 ? s[1] + '0' : s[1];
    if (!type) {
      return s[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }
    if(unit){
      const len = unit.toString().length;
      let suffix = ''
      switch (len){
        case 5:
        suffix= '万';
        break;
      }
      return val/unit + suffix
    }
    return s[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + "." + (decimal || '00');
  }
  return value;
};

// 格式化电话号码 中间4位替换成*
const telHideFormat = (value) => {
  let val = String(value).replace(/(^\s*)|(\s*$)/g, '');
  if (!isNaN(Number(val))) {
    return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  return val;
};

// 格式化银行卡号 中间替换成*
const cardNoHideFormat = (value) => {
  if (value.length > 8) {
    let pre = value.substr(0, 4);
    let ter = value.substr(-4);
    let len = value.length - 8;
    let hide = ''
    for (let i = 0; i < len; i++) {
      hide += '*';
    }
    let hideStr = pre + hide + ter;
    let cardStr = hideStr.replace(/(.{4})/g, '$1 ');
    // return pre + ' **** **** ' + ter;
    return cardStr;
  }
  return value;
};

//格式日期连接符‘-’--》'.'
const dateConnectFormat = (value) => {
  if (value) {
    return value.replace(/-/g, ".");
  }
  return value;
}
// 日期格式化 把日期时间 格式成 日期 如2021-01-08 11:48:29 => 2021-01-08 ，new Date("2019/01/01") ：new Date("2019-01-01")在safari中不支持
// new Date("2019/01/01") ：这种写法在safari、chrome上都支持
const dateFormat = (value) => {
  value = value.replace(/-/g,'/')
  const date = new Date(value);
  // 月份 日期 补0方法
  let zero = function (value) {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  };
  return date.getFullYear()+'-'+ zero(date.getMonth() + 1) + '-' + zero(date.getDate());
}

const lastFourFormat = (value) => {
  if (value.length > 4) {
    return value.substring(value.length - 4);
  }
  return value;
}
const moneyUnit = (value,suffix) => {
  if(suffix){
    return value+'元';
  }else{
    return '￥'+value
  }
}
// 字典项匹配
const dictFormat = (value, key) => {
  if (key == 'BANK_LOGO' && !dictData[key][value]) {
    return dictData[key]['default'];
  }
  return dictData[key][value] || value;
}
// 利率
const rateFormat = (value) => {
  if(value){
    return `${value}%`;
  }
  return ''
}

export default {
  moneyFormat,
  telHideFormat,
  cardNoHideFormat,
  dateConnectFormat,
  lastFourFormat,
  dictFormat,
  dateFormat,
  moneyUnit,
  rateFormat
};