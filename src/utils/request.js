import { Message } from 'element-ui'

export const urlRE = /(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/

function request(options) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.timeout = 6000

        let url = getURL(options.url)
        if (options.method === 'GET') {
            url += `${getURLParam(options.data)}`
        }
		
		xhr.open(options.method, url)

        xhr.ontimeout = reject
        xhr.onerror = reject
        xhr.onload = (e) => {
            resolve(e.target.response)
        }
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		 xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiMCIsInN5c0lkIjoiMWNhYjI3ZGVmOGZiNGMwZjk0ODZkY2Y4NDRiNzgzYzAiLCJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbIm9wZW5pZCJdLCJleHAiOjE2OTE3NDY3NDMsIm1lc3NhZ2UiOiJzdWNjZXNzIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiJlNzNjOWEzYS1mMDMwLTRkODMtYmJmYS02NjYzYWQzYWU1ZGMiLCJjbGllbnRfaWQiOiJ3ZWJfYXBwIn0.eYgxYNNCA_jl9mRbI5EpgbuGcnxfcpYvSBPGOLRWztxh28UeqJJxQQVUDxf0BvA8_Hd_E7c1lJAFwugN7cyrOT7ceticawWyyKJNR2XoNBX1kx9jrrAdaIKquog3ij5Qrm-latGJxEmXVRLeYC81vFsCTROkSBFn4cFTrri1BPqJkHRoQlMikQ98whnqWc0rdQDMWhfJC_2lIOvvGzdeOw8QoGxDEPjHLpcEKFGTHZSVw6Jy_zpVWAgsTxJHbOKzNP5ZkcUSB-Es6e_rH_OUGWC3lDtKZAtA75hLkPvyLsSIoLa2huBMcWx6L0zPvyJ1XvBJY_UhIKRFUPV2GfuMyw")
        xhr.send(JSON.stringify(getURLData(options.data, options.paramType)))
    })
}

function getURLParam(data) {
    let result = ''
    data.forEach(item => {
        if (item[0]) {
            result += `&${item[0]}=${item[1]}`
        }
    })

    return result ? '?' + result : ''
}

function getURLData(data, paramType) {
    if (!data) return ''

    if (paramType === 'array') {
        return data
    }

    const result = {}
    data.forEach(item => {
        if (item[0]) {
            result[item[0]] = item[1]
        }
    })

    return result
}

export function getURL(url) {
    return url.startsWith('http') ? url : 'https://' + url
}

/**
 *
 * @param {object} options 请求的相关参数
 * @param {object} obj 需要修改的数据的父对象
 * @param {string} key 需要修改的数据在父对象中对应的 key
 * @param {string} responseType 需要修改的数据对应的类型
 * @returns {function} 可以取消请求的函数
 */
export default function requestWarpper(options, obj, key, responseType = 'object') {
    let count = 0
    let timer
    const url = options?.url
    if (url && !/^\d+$/.test(url) || urlRE.test(getURL(url))) {
        if (!options.series) {
            request(options, responseType)
            .then(data => {
                if (responseType === 'object' || responseType === 'array') {
                    obj[key] = JSON.parse(data)
                } else {
                    obj[key] = data
                }
            })
            .catch(err => Message.error(err?.message || err))
        } else {
            timer = setInterval(() => {
                if (options.requestCount != 0 && options.requestCount <= count) {
                    clearInterval(timer)
                    return
                }

                count++
                request(options, responseType)
                .then(data => {
                    if (responseType === 'object' || responseType === 'array') {
                        obj[key] = JSON.parse(data)
                    } else {
                        obj[key] = data
                    }
                })
                .catch(err => Message.error(err?.message || err))
            }, options.time)
        }
    }

    return function cancelRequest() {
        clearInterval(timer)
    }
}
