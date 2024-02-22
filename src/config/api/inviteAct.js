import request from '@/utils/request/index'

export function queryInvestRecord (params = {}, config = { checkAuth: true }) {
    console.log('查询邀请记录统计参数', params)
    return request.post('/mbank-customer/invitationRecord/invitationRecordStatistics.do', Object.assign(params, { currentBusinessCode: '00300007' }), config)
   // return request.post('/mbank-customer/T03020', params, config)
}
export function queryRecordList (params = {}, config = { checkAuth: true }) {
    console.log('查询邀请记录参数', params)
    return request.post('/mbank-customer/invitationRecord/invitationRecordDetailed.do', Object.assign(params, { currentBusinessCode: '00300008' }), config)
   // return request.post('/mbank-customer/T03020', params, config)
}
export function queryNotice (params = {}, config = { checkAuth: true }) {
    console.log('查询邀请公告参数', params)
    return request.post('/mbank-customer/payment/invitIinfo.do', params, config)
   // return request.post('/mbank-customer/T03020', params, config)
}
export function queryCodeImg (params = {}, config = { checkAuth: true }) {
    console.log('查询二维码参数', params)
    return request.post('/mbank-customer/payment/createQRCode.do', params, config)
   // return request.post('/mbank-customer/T03020', params, config)
}
export function queryScore (params = {}, config = { checkAuth: true }) {
    console.log('查询我的战绩参数', params)
    return request.post('/mbank-customer/payment/createQRCode.do', params, config)
   // return request.post('/mbank-customer/T03020', params, config)
}