/**
 * Vue筛选器
 */
import { DateUtil } from './date-util';

const dateUtil = new DateUtil();

export function dateToZh(date) {
	const d = new Date(date);
	if (!date || d == 'Invalid Date') {
		return '';
	}
	return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
}

export function encrypteMobile(mobile) {
	if (!mobile) {
		return '';
	}
	mobile = mobile.toString();
	return mobile.substr(0, 3) + '****' + mobile.substr(7, 4);
}


export function formatDate(time, formatType) {
	if (dateUtil.format(time, 'YYYY/MM/DD') === '1970/01/01') {
		return '';
	}
	return dateUtil.format(time, formatType);
}