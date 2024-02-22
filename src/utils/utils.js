import Vue from 'vue'
import http from "./http"
import { backend,appEnv } from '@/config/app.config';
import global from '@/components/Global'
export function deepCopy(target) {
    if (typeof target == 'object') {
        const result = Array.isArray(target) ? [] : {}
        for (const key in target) {
            if (typeof target[key] == 'object') {
                result[key] = deepCopy(target[key])
            } else {
                result[key] = target[key]
            }
        }

        return result
    }

    return target
}

export function swap(arr, i, j) {
    const temp = arr[i]
    Vue.set(arr, i, arr[j])
    Vue.set(arr, j, temp)
}

export function $(selector) {
    return document.querySelector(selector)
}

const components = ['VText', 'RectShape', 'CircleShape']
export function isPreventDrop(component) {
    return !components.includes(component) && !component.startsWith('SVG')
}
export function custoptinfo(sceneCode, curRoute, stayTime = 0, remark = '',eventType) {
    let _this = this;
    http.request({
    	url: backend.manager + '/api/custevent/add/custVisitDetail',
    	method:'post',
    	data: {
    		actCode: global.actCode,
    		visitCode: global.userTempId.replaceAll('-',''),
    		pagePath: curRoute.fullPath,
    		channelCode: global.channelCode,
    		openId: localStorage.getItem('openId') || 'xiaoming',
    		orgCode: global.orgCode,
    		customerId: global.customerId,
    		routName: curRoute.meta.title,
    		sceneCode: sceneCode,
    		eventType:eventType,
    		stayTime: stayTime,
    		eventDesc: remark,
    		shareCode:global.shareCode
    	}
    }).then(res => {
    	console.log("res===",res)
    }).catch(err =>{
    	console.log("err===",err)
    })
}
