// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2023 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from '@/utils/http';
import {backend} from '@/config/app.config';
/**
 * 获取素材组别
 * @param prams
 */
export function groupTree(params) {
  return request({
    url: backend.resService + '/api/materialgroup/getgrouptree',
    method: 'get',
    params,
  });
}

/**
 * 获取素材列表
 * @param params
 */
export function findList(params) {
  return request({
    url: backend.resService + '/api/material/query',
    method: 'get',
    params,
  });
}
// 获取短信
export function sendMsgToCst(params) {
	return request({
	  url: backend.marketing + '/api/activity/opera/sendsms',
	  method:'POST',
	  data:params,
	});
}
// 登录
export function loginApi(params) {
	return request({
	  url: backend.marketing + '/api/activity/opera/registerLogin',
	  method:'POST',
	  data:params,
	});
}
