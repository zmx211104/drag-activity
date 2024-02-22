import Vue from 'vue'
import {custoptinfo} from '@/utils/utils'
export default {
  install(Vue) {
      //定义全局指令
      Vue.directive("preventReClick",(el, binding, vnode)=>{
      	let _this = vnode.context;
      	let bindValue = binding.value; // 防抖时间
      	let throttleTime = 1000; // 防抖时间
      	let timer;
      	let disable = false
      	el.addEventListener('click', event => {
      		console.log('click...')
      		 if (timer) {
      			clearTimeout(timer)
      		  }
      	   if (!disable) { // 第一次执行(一点击触发当前事件)
      			  disable = true
      			  // 记录数据
      			  console.log(888888)
      			  let curRoute = _this.$route;
      			  let sceneCode = 'stat';
      			  let eventType='2';
      			  custoptinfo(sceneCode, curRoute, 0, bindValue.remark,eventType)
      			} else {
      			  event && event.stopImmediatePropagation()
      			}
      		  timer = setTimeout(() => {
      				timer = null
      				disable = false
      			  }, throttleTime)
      	}, true);
      })
  }
}
