/**
 * @created by zhangmx2 2023-08-15
 * @description 活动配置
 * 	1、营销平台传递过来session信息,页面id（messsage)
 * 	2、查询活动配置信息
 */
import { setDefaultcomponentData } from '@/store/snapshot'
import { MessageBox, Message } from 'element-ui';
export default {
	data() {
		return {
			actCode: '', //活动id
			orgCode: '', //机构号
			basicInfData: '', //基本信息
			inviteRules: '' //活动规则
		};
	},
	 created() {
		console.log(999999)
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
		
		//如果有sessionId
		/* if(cs.sessionId){
			this.GLOBAL.sessionId = cs.sessionId;
		} */
		// 场景：预览时url拼上actCode打开
		if (options.actCode && options.orgCode) {
			// _this.$loading.show();
			console.log('页面接受actCode：' + options.actCode)
			this.GLOBAL.actCode = options.actCode;
			this.GLOBAL.orgCode = options.orgCode;
			// 将得到的 actCode 和 orgCode 存入缓存，防止单页面刷新时候取值为空
			localStorage.setItem('actCode', options.actCode);
			localStorage.setItem('orgCode', options.orgCode);
			_this.actCode = options.actCode;
			_this.orgCode = options.orgCode;
			// 获取openid -- 非首页不需要获取openid，只需要配置素材
			let isNoFist = options.isNoFist;
			// #ifdef H5
			if (this.$wechat && this.$wechat.isWechat() && !isNoFist) {
				// 其他渠道 例如 小程序、App等，需要自己传递openid和渠道号
				if (options.channelCode) {
					// 如果没有openid则随机生成一个uuid
					if (!options.openId || options.openId == 'undefined') {
						localStorage.setItem('openId', 'temp_' + this.guuId());
					} else {
						// 其他渠道还需要吧手机号和客户姓名传过来
						/* this.GLOBAL.yxActName = options.yxActName || '匿名';
						this.GLOBAL.yxActPhone = options.yxActPhone || '11111111111'
						uni.setStorageSync('openId', options.openId); */
					}
					this.GLOBAL.channelCode = options.channelCode;
					// 防止刷新页面channelCode丢失，将channelCode存入缓存
					localStorage.setItem('channelCode', options.channelCode);
					// 获取registerCode
					//_this.getRegistCode();
				} else {
					const WechatAuthFlag = `WechatAuth:${this.GLOBAL.actCode}:${this.GLOBAL.orgCode}:${localStorage.getItem('openId')}`;
					// if(!uni.getStorageSync(WechatAuthFlag) && options.orgCode != 'LFBANK'){
					/* if(options.orgCode != 'LFBANK'){
						this.$wechat.getCode().then(res => {
							this.getOpenId(res, getApp().globalData.orgCode);
							// uni.setStorageSync(WechatAuthFlag, true);
						});
					} */
				}
			}
			// #endif
		  _this.queryactivity(options.actCode, options.orgCode);
		}
	},
	methods: {
		goback() {
			uni.navigateBack({
				delta: 1
			})
		},
		S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		},
		guuId() {
			return (this.S4() + this.S4() + this.S4() + this.S4());
		},
		//获取openId
		getOpenId(code, orgCode) {
			let _this = this;
			this.$http.request({
				url: this.$backend.wxService + '/api/noAuth/openIdNew',
				data: {
					wxCode: code,
					orgCode: getApp().globalData.orgCode,
					channelCode: getApp().globalData.channelCode
				}
			}).then(res => {
				if (res.data) {
					localStorage.setItem('openId', res.data.openId);
					if (res.data.message) {
						Message({
						  message: res.data.message || 'Error',
						  type: 'error',
						  duration: 5 * 1000,
						});
					}
					
					// 获取registerCode
					_this.getRegistCode();

				}
			})
		},
		//根据活动id,页面id 查询配置信息
		queryactivity(actCode, orgCode) {
			let _this = this;
			this.$http.request({
				url: this.$backend.marketing + '/api/activity/opera/getactivityinfo',
				method:'post',
				data: {
					actCode: actCode,
					orgCode: orgCode
				}
			}).then(res => {
				if (res.data) {
					// _this.$loading.hide();
					if (res.code == "0") {
						//加载图片素材数据
						let tempPageList = res.data.tempPageList;
						//_this.updateImg(tempPageList);
						_this.GLOBAL.basicInfData = res.data.basicInfData;
						console.log("_this.GLOBAL.basicInfData===",_this.GLOBAL.basicInfData)
						_this.updateH5(tempPageList);
					} else {
						Message({
						  message: res.data.message || 'Error',
						  type: 'error',
						  duration: 5 * 1000,
						});
					}
				}
			})
		},
		shareSetting(data) {
			let _data = data;
			// #ifdef H5
			if (this.$wechat && this.$wechat.isWechat()) {
				let _this = this;
				_this.$wechat.share({
					title: _data.shareTitle,
					desc: _data.shareContent,
					branchId: this.GLOBAL.orgCode,
					shareUrl: `${_this.$appEnv.shareUrl + _data.shareUrl}?actCode=${getApp().globalData.actCode}&orgCode=${getApp().globalData.orgCode}&registCode=${getApp().globalData.registCode}`,
					img: _data.shareImg
				});
			}
			// #endif
		},
		updateH5(array) {
			console.log(888888)
			let _this = this;
			/* let page = array.filter(function(item) {
				return item.pageUrl.indexOf(_this.yxPageUrl) > -1;
			}) */
			let page = array;
			if (page.length > 0) {
				let pageData = page[0].pageData;
				console.log("pageData[0].canvasData===",pageData[0].canvasData)
				setDefaultcomponentData(pageData[0].canvasData)
				this.$store.commit('setComponentData', pageData[0].canvasData)
				this.$store.commit('setCanvasStyle', pageData[0].canvasStyle)
				this.$store.state.materialList = pageData[0].materialList
			}
			this.setCopy();
		},
	}
};
