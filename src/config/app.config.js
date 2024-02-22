/**
 * @created by anonymous 2019-12-08
 * @updated by
 * @description APP全局参数配置
 * 1. appEnv 参数配置
 * 2. backend 后台API服务映射表
 * TODO: 相比.env.xxx配置缺点，开发者提交后可能会覆盖服务器上的配置，后续权衡如何优化
 */

/**
 * app 环境参数配置
 */
const appEnv = {
	appName: '宇信银行', // 应用名称
	appRunType: 'app', // app | h5
	// #ifdef H5 || MP
	apiVersion: '1.0.0', // api版本
	// #endif
	host: '', // 请求服务主机地址
	appVerUrl: '', // 版本更新服务器地址
	appAssetsUrl: '', // 资源服务器地址(eg:广告)
	devMode: 'PRO', // MOCK 外网挡板数据/ LOCAL 本地挡板数据/SIT/UAT/PRO
	touristMode: true, // 开放式,H5模式可以直接进入应用业务页面
	pageNum: '', // 打开业务页面数量，根据测试情况配置
	showWxMask: false, //是否打开非微信环境的遮罩
	// appId: '', //微信公众号需要使用的
	appId: '', //微信公众号需要使用的
	// appId: 'wx4b45c3f85bba1e39',//微信公众号需要使用的  生产的时候把这个注释去了，其他appId的注释
	// branchId: 'A00250001' // 机构号
};

// 根据不同的开发环境，配置不同的主机及静态资源
switch (appEnv.devMode) {
	case 'PRO':
		appEnv.secIdentify = "aaa7056278c7ce7e06b5d8c2c62cffc5" // 生产上注意，可能要修改 （白名单活动会用到此配置）
		appEnv.appId = 'wx4b45c3f85bba1e39'; //（X运营）wx5b1eabc2b2409f29
		// appEnv.appId = 'wx5b1eabc2b2409f29'; //宇信数字运营
		// appEnv.secIdentify = "dusr6011mqc2tfhgu1z40dczg7vdutoc"//宇信数字运营
		appEnv.host = 'https://yuac.aimsys.com.cn/yxcenter';
		appEnv.fastDFS = 'https://yuac.aimsys.com.cn/yump-file/'
		appEnv.assetsUrl = 'https://yuac.aimsys.com.cn/yump-file/'; // WEB服务器静态资源路径
		appEnv.shareUrl = 'https://yuac.aimsys.com.cn'; //分享的链接和图片地址
		appEnv.imageUrl = 'https://yuac.aimsys.com.cn/mbankImages/'; // WEB服务器静态资源路径
		appEnv.branchId = 'A00250001' // 机构号 暂时不知道是哪一个
		break;
	case 'UAT':
		appEnv.appId = 'wx191dc3d72d240805';
		appEnv.host = 'https://marketingdemo.yusyscloud.com/yxcenter';
		appEnv.fastDFS = 'https://marketingdemo.yusyscloud.com/yump-file/'
		appEnv.assetsUrl = 'https://marketingdemo.yusyscloud.com/yump-file/'; // WEB服务器静态资源路径
		appEnv.shareUrl = 'https://marketingdemo.yusyscloud.com/'; //分享的链接和图片地址
		appEnv.branchId = 'A00250001' // 机构号 暂时不知道是哪一个
		break;
	case 'SIT':
		appEnv.secIdentify = "279d0ff5419540b8ad7edd99f6c12f72"
		appEnv.appId = 'wxd3a85e6861dfec4b';
		appEnv.host = '/yxcenter';
		// appEnv.host = 'http://172.20.35.96:8081'
		appEnv.assetsUrl = '/yump-file/'; // WEB服务器静态资源路径
		appEnv.shareUrl = 'http://yuac.x-winner.com'; //分享的链接和图片地址
		appEnv.imageUrl = 'https://yuac.aimsys.com.cn/mbankImages/'; // WEB服务器静态资源路径
		appEnv.branchId = 'A00250001' // 机构号 暂时不知道是哪一个
		break;
	case 'MOCK':
		appEnv.host = ''; // 外网mock挡板测试环境
		appEnv.assetsUrl = 'http://localhost:9102/assets/'; // WEB服务器静态资源路径
		appEnv.branchId = 'A00250001' // 机构号 暂时不知道是哪一个
		break;
		
	case 'UAT2':
		// appEnv.secIdentify = "27d0911448b54f74b84627d59e541ef6"; // 默认是测试环境的
		// appEnv.appId = 'wx0dac175aa2b61d3a'; // yangyw5 个人测试微信号wx7c365e06a67964b1
		appEnv.secIdentify = "dusr6011mqc2tfhgu1z40dczg7vdutoc" // 百晓生
		appEnv.appId = 'wx7c365e06a67964b1'
		// appEnv.appId = 'wx7c365e06a67964b1'; 
		appEnv.host = 'http://yuac.x-winner.com/yxcenteruat';
		appEnv.mockData = 'http://yuac.x-winner.com/mockData'; // 当访问链接拼接了isPreview=true时会读取服务器的mockData文件
		appEnv.fastDFS = 'http://yuac.x-winner.com/yump-file/';
		appEnv.assetsUrl = 'http://yuac.x-winner.com/yump-file/'; // WEB服务器静态资源路径
		appEnv.shareUrl = 'http://yuac.x-winner.com'; //分享的链接和图片地址
		appEnv.imageUrl = 'https://yuac.aimsys.com.cn/mbankImages/'; // WEB服务器静态资源路径
		appEnv.branchId = 'A00240001' // 机构号   用的是测试号： wxid_zkbakk42376j22的接口测试号
		break;
	default:
		// appEnv.secIdentify = "27d0911448b54f74b84627d59e541ef6"; // 默认是测试环境的
		appEnv.secIdentify = "b7123349d6bd97b2ef1b30f3bec0b3a5" // yangyw5 个人测试微信号
		appEnv.appId = 'wx0dac175aa2b61d3a'// yangyw5 个人测试微信号
		// appEnv.appId = 'wx7c365e06a67964b1'; // 百晓生
        // appEnv.secIdentify = "dusr6011mqc2tfhgu1z40dczg7vdutoc" // 百晓生
		//appEnv.host = 'http://192.168.3.66:8081';
		appEnv.host = 'https://yuac.aimsys.com.cn/yxcentersit';
		appEnv.mockData = 'https://yuac.aimsys.com.cn/mockData'; // 当访问链接拼接了isPreview=true时会读取服务器的mockData文件
		appEnv.fastDFS = 'https://yuac.aimsys.com.cn/yump-file/';
		appEnv.assetsUrl = 'https://yuac.aimsys.com.cn/yump-file/'; // WEB服务器静态资源路径
		appEnv.shareUrl = 'https://yuac.aimsys.com.cn'; //分享的链接和图片地址
		appEnv.imageUrl = 'https://yuac.aimsys.com.cn/mbankImages/'; // WEB服务器静态资源路径
		appEnv.branchId = '500' // 机构号   用的是测试号： wxid_zkbakk42376j22的接口测试号
		break;
};

/**
 * 全局后台API服务映射表
 */
const backend = {
	marketing: '/yu-ebank-marketing-service',
	manager: '/yu-ebank-manage-service',
	wxService: '/yu-ebank-wxverify-service',
	rightService: '/yu-ebank-right-service', //权益微服务
	goodsService: '/yu-ebank-goods-service',
	user: '/yu-ebank-user-service',
	uaa: '/yusp-ebank-uaa',
	resService:'/yu-ebank-resource-service'
};

// 读取mock文件数据的接口
// 当mock开关开启时，改数组中的接口会去读取mock文件数据，mock开关在App.vue中配置，由活动链接是否携带isPreview=true控制
const readMockList = [
	'/api/category/gainSimpleCategory', // 分类导航查询接口
	'/api/activity/opera/gotosigninhomepage', // 签到初始化接口
	'/api/activity/opera/getdrawnum', // 抽奖次数接口
	'/api/activity/opera/usersign', //签到
	'/api/activity/opera/draw', //签到活动抽奖/抽奖活动接口
	'/api/activity/opera/gotodrawhomepage', // 抽奖接口初始化
	'/api/activity/opera/gotoinvitehomepage' // 邀请活动初始化
]

module.exports = {
	appEnv,
	backend,
	readMockList
}
