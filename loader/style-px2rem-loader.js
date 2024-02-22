module.exports = function(content, map, meta) {
  // let reg = /(\d+(\\.\d+)?)px/g
  let reg = /(?<num1>\d+)\.?(?<num2>\d+)?px/g  // 匹配所有px 相关的字符
  let content1 = content.replace(reg,function(...data){ // px 转换为带小数的rem
        var arr = data[data.length-1]
        var num1=0, num2=0;
        if(arr.num1)num1=parseFloat(arr.num1)
        if(arr.num2)num2=parseFloat(arr.num2)
        return  parseFloat(num1+'.'+num2)/16 + 'rem' // 这里以16px 为pc端转换基数 适配1920分辨率
      })
  return content1
};