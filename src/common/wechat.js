var jweixin = require('jweixin-module')
import { backend, appEnv } from '@/config/app.config'
import http from '@/utils/http'
export default {
  //判断是否在微信中
  isWechat: function() {
    var ua = window.navigator.userAgent.toLowerCase()
    if (ua.match(/micromessenger/i) == 'micromessenger') {
      return true
    } else {
      return false
    }
  },
  //获取code -- 静默授权
  getCode() {
    return new Promise((resolve) => {
      // 获取微信h5的code
      const code = this.getUrlParam('code') // 截取路径中的code
      // alert("静默授权时，url的code==>"+code);
      if (code == null || code === '') {
        const href = window.location.href
        const local = href.split('code')[0]
        window.location.href =
          'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
          appEnv.appId +
          '&redirect_uri=' +
          encodeURIComponent(local) +
          '&response_type=code&scope=snsapi_base&state=456#wechat_redirect'
      } else {
        resolve(code)
        // this.getOpenId(code) //把code传给后台获取用户信息
      }
    })
  },
  getCodeByAppId(appId) {
    return new Promise((resolve) => {
      // 获取微信h5的code
      const code = this.getUrlParam('code') // 截取路径中的code
      // alert("静默授权时，url的code==>"+code);
      if (code == null || code === '') {
        const href = window.location.href
        const local = href.split('code')[0]
        window.location.href =
          'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
          appId +
          '&redirect_uri=' +
          encodeURIComponent(local) +
          '&response_type=code&scope=snsapi_base&state=456#wechat_redirect'
      } else {
        resolve(code)
        // this.getOpenId(code) //把code传给后台获取用户信息
      }
    })
  },
  //获取code -- 弹窗授权 可获取用户昵称等信息
  getNewCode() {
    return new Promise((resolve) => {
      // 获取微信h5的code
      const code = this.getUrlParam1('code') // 截取路径中的code
      // alert("非静默授权时，url的code==>"+code);
      if (code == null || code === '') {
        const href = window.location.href
        const local =
          href.split('code')[0] +
          '#/pages/activity/newYearsDay/indexOne?t=1640585361000'
        window.location.href =
          'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
          appEnv.appId +
          '&redirect_uri=' +
          encodeURIComponent(local) +
          '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
      } else {
        resolve(code)
        // this.getOpenId(code) //把code传给后台获取用户信息
      }
    })
  },

  getNewCode2(num) {
    return new Promise((resolve) => {
      // 获取微信h5的code
      const code = this.getUrlParam2('code') // 截取路径中的code
      if (code == null || code === '') {
        const local =
          'https://yuac.aimsys.com.cn/activityH5/#/pages/activity/newYearsDay/questionsAnswer'

        window.location.href =
          'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
          appEnv.appId +
          '&redirect_uri=' +
          encodeURIComponent(local) +
          '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
      } else {
        resolve(code)
        // this.getOpenId(code) //把code传给后台获取用户信息
      }
    })
  },

  // 下面是重定向的方法
  getNewCode_ques() {
    return new Promise((resolve) => {
      // 获取微信h5的code
      const code = this.getUrlParam3('code') // 截取路径中的code
      // alert("非静默授权时，url的code==>" + code);
      // debugger
      // alert('测试（不是bug）code===' + code)
      if (code == null || code == '') {
        const href = window.location.href
        const local = href.split('code')[0]
        window.location.href =
          'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
          appEnv.appId +
          '&redirect_uri=' +
          encodeURIComponent(local.replace('http://', '')) +
          '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
        //  下面是廊坊银行的方法
        // const redirectUrl = window.location.href;
        // let param = 'appid=' + appid
        // param += '&response_type=code'
        // param += '&scope=snsapi_userinfo'
        // param += '&redirect_uri=' + encodeURIComponent(redirectUrl)
        // param += '&state=qv#wechat_redirect'
        // window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?' + param)
        // alert('微信重定向')
      } else {
        resolve(code)
      }
    })
  },

  getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let url = window.location.href.split('#')[0]
    let search = url.split('?')[1]
    if (search) {
      var r = search.substr(0).match(reg)
      if (r !== null) return unescape(r[2])
      return null
    } else return null
  },

  getUrlParam1(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let url = window.location.href.split('#')[0]

    let url2 = url.split('code')[0]
    // alert("根据code切割后的url:" + url2)
    let search = url2.split('?')[1]
    if (search) {
      var r = search.substr(0).match(reg)
      if (r !== null) return unescape(r[2])
      return null
    } else return null
  },

  getUrlParam2(name) {
    // alert('getUrlParam2' + name)
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let url = window.location.href.split('#')[0]

    let url2 = url.replace('code', 'nvidia')
    let search = url2.split('?')[1]
    if (search) {
      var r = search.substr(0).match(reg)
      if (r !== null) return unescape(r[2])
      return null
    } else return null
  },
  getUrlParam3(name) {
    // 截取url中的code方法
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    // alert ('window.location.href===' + window.location.href)
    let url = window.location.href.split('#')[0]
    let url2 = url.split('#')[0]
    var search = url2.split('?')[1]
    if (search) {
      var r = search.substr(0).match(reg)
      if (r !== null) return unescape(r[2])
      return null
    } else return null
  },

  //初始化sdk配置
  initJssdk: function(callback, url, branchId) {
    //服务端进行签名 ，可使用uni.request替换。 签名算法请看文档
    http
      .request({
        url: backend.wxService + '/api/wxauth/getsign',
        data: {
          branchId: branchId,
          currentUrl: url,
          channelId: getApp().globalData.channelCode,
        },
      })
      .then((res) => {
        if (res.data) {
			//alert("res===", JSON.stringify(res))
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
              'hideAllNonBaseMenuItem',
              'showAllNonBaseMenuItem',
              'getLocation'
            ],
          })
          //配置完成后，再执行分享等功能
          if (callback) {
            callback(res.data)
          }
        }
      })
  },
  //在需要自定义分享的页面中调用
  share: function(data) {
    let signUrl = window.location.href.split('#')[0]
    if (!this.isWechat()) {
      return
    }
	//alert('用户分享了hhhhh:' + data.shareUrl)
    //每次都需要重新初始化配置，才可以进行分享
    this.initJssdk(
      function(signData) {
        jweixin.ready(function() {
          var shareData = {
            title: data.title,
            desc: data.desc,
            link: data.shareUrl + '&t=' + Date.parse(new Date()),
            imgUrl: data.img,
            success: function(res) {
               //alert('用户分享了:' + JSON.stringify(res))
              //用户点击分享后的回调，这里可以进行统计，例如分享送金币之类的
              // request.post('/api/member/share');
            },
            cancel: function(res) {},
          }
          //分享给朋友接口
		  // alert('用户分享了111:' + data.shareUrl)
          jweixin.updateAppMessageShareData(shareData)
          //分享到朋友圈接口
          jweixin.updateTimelineShareData(shareData)
        })
      },
      signUrl,
      data.branchId
    )
  },
  // 获取地址经纬度，导航
  getLocation: function(data) {
		let _this = this
		return new Promise(function(resolve, rejected){
			let signUrl = window.location.href.split('#')[0]
			if (!_this.isWechat()) {
				return
			}
			_this.initJssdk(
				function(signData) {
					jweixin.ready(function() {
						console.log('jweixin.ready')
						jweixin.getLocation({
							signData,
							type: 'gcj02', // 默认为wgs84的 gps 坐标，如果要返回直接给 openLocation 用的火星坐标，可传入'gcj02'
							success: function(res) {
								console.log('location res', res)
								resolve(res)
								// var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
								// var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
								// var accuracy = res.accuracy // 位置精度
							},
							fail: function(err){
								console.log('fail')
								rejected(err)
							}
						})
					})
				},
				signUrl,
				data.branchId
			)
		})
  },
  showAllNonBaseMenuItem(){
    let _this = this
		return new Promise(function(resolve, rejected){
			let signUrl = window.location.href.split('#')[0]
			if (!_this.isWechat()) {
				return
			}
			_this.initJssdk(
				function(signData) {
					jweixin.ready(function() {
						jweixin.showAllNonBaseMenuItem({
							// signData,
              // menuList: []
						})
					})
				},
				signUrl,
				data.branchId
			)
		})
  },
  getWx(data){
    let _this = this
		return new Promise(function(resolve, rejected){
			let signUrl = window.location.href.split('#')[0]
			if (!_this.isWechat()) {
				return
			}
			_this.initJssdk(
				function(signData) {
					jweixin.ready(function() {
            resolve([jweixin, signData])
					})
				},
				signUrl,
				data.branchId
			)
		})
  },
  hideAllNonBaseMenuItem(){
    let _this = this
		return new Promise(function(resolve, rejected){
			let signUrl = window.location.href.split('#')[0]
			if (!_this.isWechat()) {
				return
			}
			_this.initJssdk(
				function(signData) {
					jweixin.ready(function() {
						jweixin.hideAllNonBaseMenuItem({
							// signData,
              // menuList: []
						})
					})
				},
				signUrl,
				data.branchId
			)
		})
  },
	getDevice(){
		let ua = navigator.userAgent;
		let isAndroid = /android/i.test(ua);
		let isIOS = /(iPhone|iPad|iPod|IOS)/i.test(ua);
		return isAndroid ? 'android' : isIOS ? 'ios' : 'other'
	},
  async getOpenIdWithCode(code) {
    let res = await http.request({
      url: backend.wxService + '/api/noAuth/authorization',
      data: {
        code: code,
        id: appEnv.secIdentify,
        scope: 'snsapi_userinfo',
      },
    })
    if (res.data) {
      return res.data.data.openId
    } else {
      throw 'authorization error'
    }
  },
}
