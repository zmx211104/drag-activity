/**
 * @created by anonymous 2019-12-08
 * @updated by
 * @description 遵循UMD规范，业务数据字典
 * TODO: 待优化，要结合远程数据字典一并考虑，
 * 数据字典
 */
/* eslint camelcase: 0 */
let dictData = {
  // 本地数据字典，根据实际情况删除添加
  // 交易状态
  STT: {
    '50': '待处理',
    '90': '成功',
    '91': '失败',
    '99': '可疑'
  },
  // 性别
  GNDRCD: {
    '1': '男',
    '2': '女'
  },

  /**
   * 根据类型名称 和id获取value
   * @param appName 类型名称
   * @param appValue 类型id
   * @returns
   */
  getDisplay: function (appName, appValue) {
    var map = null;

    if (typeof appName === 'string') {
      map = this[ appName ];
    } else {
      map = appName;
    }
    if (!map) {
      return null;
    }
    appValue = this.trim(appValue);
    if (map[appValue] == undefined || map[appValue] == 'undefined') {
      return appValue;
    }

    return map[appValue];
  },
  /**
   *  根据key获取JSON对象
   * @param {Object} key
   */
  getParams: function (key) {
    // if (this.isEmpty(key)) {
    //   return {};
    // }
    if (!key) {
      return {};
    }
    return this[ key ];
  }

}
/**
 * 根据 key返回数据字典 形式为 key,value数组
 * @param {*} key 
 */
export function getDictByKey(key){
  let obj = dictData.getParams(key);
  let array = [];
  Object.keys(obj).forEach(item=>{
    array.push({
      key:item,
      value:obj[item]
    })
  })
  return array
}
export default dictData

// ;(function (root, factory) {
//   if (typeof define === 'function' && define.cmd) { // CMD规范 seaJS
//     define(factory);
//   } else if (typeof define === 'function' && define.amd) { // AMD规范 requireJS
//     define(['exports'], factory);
//   } else if (typeof module !== 'undefined' && module.exports) { // CommonJS规范，nodejs,webpack,vue....
//     module.exports = factory();
//   } else { // window环境下执行
//     root.__app_params = factory();
//   }
// }(this, function () {
//   return dictData;
// }));