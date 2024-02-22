export default (vue) => {
  /**
   * 绑定方法
   * @param {Object} el - The element the directive is bound to.
   * @param {Object} binding - An vue directive object
   * el:指令属性所在的标签对象
     binding包含指令相关信息数据的对象
     项目需要全局生效的自定义指令统一放在这个文件，注意，这里的vue小写
     关键点:vue 的自定义指令传递的参数binding 如果是一个函数,则通过binding.value()来执行,通过上述示例,还可以传递比如事件, 绑定对象之类的
   */
  vue.directive('debounce', { //防抖函数指令
    inserted: function (el, binding) {
      // console.log('binding.arg ===', )
      let timer;
      let times = binding.arg ? binding.arg : 1000;
      let aaa = true
      el.addEventListener("click", () => {
        if (aaa) {
          binding.value();
        }
        aaa = false;
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          aaa = true;
        }, times);
      });
    }
  });
  // 转大写自定义在指令
  vue.directive("upper-text", function (el, binding) {
    console.log('el===', el);
    console.log('binding===', binding);
    el.textContent = binding.value.toUpperCase()
  })
}