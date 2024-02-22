import eventBus from '@/utils/eventBus'
import {custoptinfo} from '@/utils/utils'
// 编辑器自定义事件
const events = {
    redirect(url) {
        if (url) {
			//跳转链接埋点
			let curRoute = this.$route;
			let sceneCode = 'click';
			let eventType='2';
			custoptinfo(sceneCode, curRoute, 0, "跳转链接",eventType)
            window.location.href = url
        }
    },

    dialog(msg) {
        if (msg) {
            // eslint-disable-next-line no-alert
			if(msg=='111'){
				// alert(msg)
				//规则弹窗埋点
				let curRoute = this.$route;
				let sceneCode = 'click';
				let eventType='2';
				custoptinfo(sceneCode, curRoute, 0, "打开规则弹窗",eventType)
				//弹出规则弹窗，触发规则弹窗组件自定义的全局事件(在h5实现)
				 eventBus.$emit('openDialog', msg)
			}
        }
    },
}

const mixins = {
    methods: events,
}

const eventList = [
    {
        key: 'redirect',
        label: '链接跳转事件',
        event: events.redirect,
        param: '',
    },
    {
        key: 'dialog',
        label: '功能事件',
        event: events.dialog,
        param: '',
    },
]

export {
    mixins,
    events,
    eventList,
}