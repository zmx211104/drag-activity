var jweixin = require('jweixin-module');
import {
	backend,
	appEnv
} from '@/config/app.config';
import http from '@/utils/request';
export default {
	//判断是否在微信中  
	isWechat: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},
	//获取code -- 静默授权
	getCode() {
		return new Promise(resolve => {
			// 获取微信h5的code
			const code = this.getUrlParam('code') // 截取路径中的code
			// alert("静默授权时，url的code==>"+code);
			if (code == null || code === '') {
				const href = window.location.href
				const local = href.split("code")[0]
				window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appEnv.appId + '&redirect_uri=' + encodeURIComponent(local) +
					'&response_type=code&scope=snsapi_base&state=456#wechat_redirect';
			} else {
				resolve(code);
				// this.getOpenId(code) //把code传给后台获取用户信息
			}
		});
	},
	//获取code -- 弹窗授权 可获取用户昵称等信息
	getNewCode() {
		return new Promise(resolve => {
			// 获取微信h5的code
			const code = this.getUrlParam1('code') // 截取路径中的code
			// alert("非静默授权时，url的code==>"+code);
			if (code == null || code === '') {
				const href = window.location.href
				const local = href.split("code")[0] + '#/pages/activity/newYearsDay/indexOne?t=1640585361000'
				window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appEnv.appId + '&redirect_uri=' + encodeURIComponent(local) +
					'&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
			} else {
				resolve(code);
				// this.getOpenId(code) //把code传给后台获取用户信息
			}
		});
	},
	
	getNewCode2(num) {
		return new Promise(resolve => {
			// 获取微信h5的code
			const code = this.getUrlParam2('code') // 截取路径中的code
			if (code == null || code === '') {
				const local = 'https://yuac.aimsys.com.cn/activityH5/#/pages/activity/newYearsDay/questionsAnswer';
				
				window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appEnv.appId + '&redirect_uri=' + encodeURIComponent(local) +
					'&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
			} else {
				resolve(code);
				// this.getOpenId(code) //把code传给后台获取用户信息
				
				
			}
		});
	},
	
	getUrlParam(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
		let url = window.location.href.split('#')[0]
		let search = url.split('?')[1]
		if (search) {
			var r = search.substr(0).match(reg)
			if (r !== null)
				return unescape(r[2])
			return null
		} else
			return null
	},
	
	getUrlParam1(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
		let url = window.location.href.split('#')[0]
		
		let url2 = url.split('code')[0]
		// alert("根据code切割后的url:"+url2)
		let search = url2.split('?')[1]
		if (search) {
			var r = search.substr(0).match(reg)
			if (r !== null)
				return unescape(r[2])
			return null
		} else
			return null
	},
	
	getUrlParam2(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
		let url = window.location.href.split('#')[0]
		
		let url2 = url.replace('code','nvidia')
		let search = url2.split('?')[1]
		if (search) {
			var r = search.substr(0).match(reg)
			if (r !== null)
				return unescape(r[2])
			return null
		} else
			return null
	},
	//初始化sdk配置  
	initJssdk: function(callback, url, branchId) {
		//服务端进行签名 ，可使用uni.request替换。 签名算法请看文档  
		http.request({
			url: backend.wxService + '/api/wxauth/getsign',
			data: {
				branchId:branchId,
				currentUrl: url,
				channelId: getApp().globalData.channelCode
			}
		}).then(res => {
			if (res.data) {
				jweixin.config({
					debug: false,
					appId: res.data.data.appId,
					timestamp: res.data.data.timestamp,
					nonceStr: res.data.data.nonce_str,
					signature: res.data.data.signature,
					jsApiList: [
						'checkJsApi',
						'updateAppMessageShareData',
						'updateTimelineShareData',
						'openLocation',
						'getLocation',
						'openAddress'
					]
				});
				//配置完成后，再执行分享等功能  
				if (callback) {
					callback(res.data);
				}
			}
		})
	},
	//在需要自定义分享的页面中调用  
	share: function(data) {
		let signUrl = window.location.href.split('#')[0];
		if (!this.isWechat()) {
			return;
		}
		//每次都需要重新初始化配置，才可以进行分享  
		this.initJssdk(function(signData) {
			jweixin.ready(function() {
				var shareData = {
					title: data.title,
					desc: data.desc,
					link: data.shareUrl + '&t=' + Date.parse(new Date()),
					imgUrl: data.img,
					success: function(res) {
						// alert('用户分享了:' + JSON.stringify(res))
						//用户点击分享后的回调，这里可以进行统计，例如分享送金币之类的  
						// request.post('/api/member/share');  
					},
					cancel: function(res) {}
				};
				//分享给朋友接口  
				jweixin.updateAppMessageShareData(shareData);
				//分享到朋友圈接口  
				jweixin.updateTimelineShareData(shareData);
			});
		}, signUrl,data.branchId);
	},
	// 获取地址经纬度，导航
	getLocation: function(data){
		let signUrl = window.location.href.split('#')[0];
		if (!this.isWechat()) {
			return;
		}
		var _this = this;
		this.initJssdk(function(signData) {
			jweixin.ready(function() {
				//分享给朋友接口  
				jweixin.getLocation({
				  type: 'gcj02', // 默认为wgs84的 gps 坐标，如果要返回直接给 openLocation 用的火星坐标，可传入'gcj02'
				  success: function (res) {
					var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
					var speed = res.speed; // 速度，以米/每秒计
					var accuracy = res.accuracy; // 位置精度
					jweixin.openLocation({
					  latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
					  longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
					  name: '新东方', // 位置名
					  address: '新东方大厨房', // 地址详情说明
					  scale: 20, // 地图缩放级别,整型值,范围从1~28。默认为最大
					  infoUrl: '/pages/myEquity/myEquity' // 在查看位置界面底部显示的超链接,可点击跳转
					});
				  }
				});
				// jweixin.getLocation(shareData);
			});
		}, signUrl,data.branchId);
	},
	// 打开微信收货地址
	openAddress: function(data){
		let signUrl = window.location.href.split('#')[0];
		if (!this.isWechat()) {
			return;
		}
		this.initJssdk(function(signData) {
			jweixin.ready(function() {
				var localData = {
					success: function(res) {
						// 目前iOS回调没反应  有人是这样说的，尝试修改过还是不行，也可能尝试的不对
						//选择地址成功返回之后，有走到 success 回调里，并且 res 内容正常。只是这时候 alert 是没反应的，你用 vConsole 打印下 log 就看到回调内容了。
						//至于为何 alert 没有效果？是因为 alert 的时候，贵公司的网页还没有完全可见（被选择微信地址的页面挡住了），这时候第三方网页是无法弹窗的，时机问题。请悉知。
						alert(res)
					},
					cancel: function(res) {},
					fail:function(err){
					}
				};
				jweixin.openAddress(localData);
				// jweixin.getLocation(shareData);
			});
		}, signUrl,data.branchId);
	}
}
