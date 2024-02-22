/**
 * @created by zhangmx2 2023-09-12
 * @description 统计页面（跳转页面、参数传递、停留时间）
 */
let enterTime = '';
let outTime = '';
let stayTime = '';
export default {
	data() {
		return {

		};
	},
	created(){
		// 判断运行环境
		// #ifdef MP-WEIXIN
		this.GLOBAL.channelCode = '2' // 微信小程序
		// #endif
		
		// #ifdef APP-PLUS
		this.GLOBAL.channelCode = '3' // APP
		// #endif
		
		// #ifdef H5
		this.GLOBAL.channelCode = '0' // H5
		if (this.$wechat && this.$wechat.isWechat()) {
			this.GLOBAL.channelCode = '1' // 微信H5
		}
		// #endif
	},
	mounted() {
		//页面加载
		//获取每个客户唯一标识，并存入缓存
		localStorage.setItem('userTempId', this.guuId());
		if(!this.GLOBAL.userTempId){
			this.GLOBAL.userTempId = this.guuId();
		}
		const queryString = window.location.href;
		var options = queryString.split('?')[1];                //获取?之后的参数字符串
		var cs_arr = options.split('&');                    //参数字符串分割为数组
		var options={};
		for(var i=0;i<cs_arr.length;i++){         //遍历数组，拿到json对象
		  options[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1]
		}
		
		// 动态配置页面信息
		let _this = this;
		console.log('页面url携带的参数：' ,options)
		if(options.shareCode){
			this.GLOBAL.shareCode = options.shareCode; 
		}
		// 用户进入时间
		enterTime = new Date();
		console.log(`用户进入时间:${enterTime}`);
		let curRoute = this.$route;
		console.log("curRoute===",curRoute)
		let sceneCode = 'mounted';
		let eventType = this.eventType;
		let remark = this.remark;
		this.custoptinfo(sceneCode, curRoute,'',remark,eventType)
		// 阻止ios和安卓调整字体大小时候的事件，ios通过添加css属性，安卓通过微信属性去阻止
		if (this.$wechat.isWechat()) {
			(function() {
				if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
					handleFontSize();
				} else {
					document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
				}

				function handleFontSize() {
					// 设置网页字体为默认大小
					WeixinJSBridge.invoke('setFontSizeCallback', {
						'fontSize': 0
					});
					// 重写设置网页字体大小的事件
					WeixinJSBridge.on('menu:setfont', function() {
						WeixinJSBridge.invoke('setFontSizeCallback', {
							'fontSize': 0
						});
					});
				}
			})();
		}
	},
	onShow() {
		// 非微信环境加一个遮罩
		// #ifdef H5
		if (this.$appEnv.showWxMask) {
			if (this.$wechat && this.$wechat.isWechat()) {
				// this.getCode();
			} else {
				const local = window.location.href;
				if (local.indexOf('maskPage') == -1) {
					this.$yuRouter.navigateTo({
						route: {
							path: '/pages/index/maskPage'
						}
					});
				}
			}
		}
		// #endif
	},
	methods: {
		custoptinfo(sceneCode, curRoute, stayTime = 0, remark = '',eventType) {
			let _this = this;
			this.$http.request({
				url: this.$backend.manager + '/api/custevent/add/custVisitDetail',
				method:'post',
				data: {
					actCode: this.GLOBAL.actCode,
					visitCode: this.GLOBAL.userTempId.replaceAll('-',''),
					pagePath: curRoute.fullPath,
					channelCode: this.GLOBAL.channelCode,
					openId: localStorage.getItem('openId') || 'xiaoming',
					orgCode: this.GLOBAL.orgCode,
					customerId: this.GLOBAL.customerId,
					routName: curRoute.meta.title,
					sceneCode: sceneCode,
					eventType:eventType,
					stayTime: stayTime,
					eventDesc: remark,
					shareCode:this.GLOBAL.shareCode
				}
			}).then(res => {
				console.log("res===",res)
			}).catch(err =>{
				console.log("err===",err)
			})
		},
		guuId() {
		    var s = [];
		    var hexDigits = "0123456789abcdef";
		    for (var i = 0; i < 36; i++) {
		        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		    }
		    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		    s[8] = s[13] = s[18] = s[23] = "-";
		
		    var uuid = s.join("");
		    return uuid;
		}
	},
	destroyed() {
		console.log('destroyed')
		console.log(`卸载时打印活动代码${this.GLOBAL.actCode}`)
		// 用户退出时间
		outTime = new Date();
		//停留时间(毫秒)
		stayTime = outTime.getTime() - enterTime.getTime();
		let curRoute =  this.$route;
		//卸载时传参 -- onload 问题
		//时间大于5s则发向后台?还是后台判断
		// alert(curRoute+'页面卸载'+(stayTime/1000)+'s')
		console.log(`页面卸载-停留时间:${curRoute}-${stayTime/1000}s`);
		//发送完之后将param清空 -- 不然中间页面卸载时的参数会出错
		//向后台发送埋点请求
		let sceneCode = 'destroyed';
		this.custoptinfo(sceneCode, curRoute, stayTime,'','4')
	}
};
