/**
 * @created by anonymous 2019-12-09
 * @updated by
 * @description APP全局插件（组件、图标、过滤器、工具方法等）安装
 */
import { backend,appEnv } from '@/config/app.config';
import http from '@/utils/http';
// import mixins from '@/utils/mixins';
import pageStatistics from '@/utils/mixins/pageStatistics'
import activityConfig from '@/utils/mixins/activityConfig'
import router from '@/router/index';
import filters from '@/utils/filters';
import store from '@/store'

/**
 * 安装插件，注意方法里面使用时vue对象时是小写的变量
 * @param {Object} vue Vue对象
 */
const install = function(vue) {
	// 注入到实例上
	vue.prototype.$backend = backend;
	vue.prototype.$appEnv = appEnv;
	vue.prototype.$http = http;
	vue.prototype.$yuRouter = router;
	vue.prototype.$store = store;
	// 全局混入
	//vue.mixin(pageStatistics);
	//vue.mixin(activityConfig);
  // vue.mixin(mixins);
	// 全局注入过滤器
	Object.keys(filters).forEach((key) => {
		vue.filter(key, filters[key]);
	});
};

export default install;
