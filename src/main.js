import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import store from './store'
import router from './router'
import '@/custom-component' // 注册自定义组件
import global from '@/components/Global'
Vue.prototype.GLOBAL = global;

import '@/assets/iconfont/iconfont.css'
import '@/styles/animate.scss'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/reset.css'
import '@/styles/global.scss'
import directive from '@/utils/directive'
import install from './utils/install'

//注册
directive(Vue)
import wechat from '@/common/wechat'
Vue.prototype.$wechat = wechat

import { getParam } from './utils/getParam.js'
Vue.prototype.$getParam = getParam
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

Vue.use(ElementUI, { size: 'small' })
Vue.config.productionTip = false
import 'amfe-flexible';
import preventReClick from '@/utils/clickDirect'
Vue.use(preventReClick);
// APP全局插件（组件、图标、过滤器、工具方法等）安装
install(Vue)
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})