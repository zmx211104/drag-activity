import { DateUtil } from './date-util'

const dateUtil = new DateUtil();

describe('isLegalDate', () => {
  it('---happly path 参数合法, 返回true', () => {
		expect(dateUtil.isLegalDate(new Date())).toEqual(true);
		expect(dateUtil.isLegalDate(Date.now())).toEqual(true);
		expect(dateUtil.isLegalDate('2019/01/01')).toEqual(true);
	});
	
	it('---参数非法, 返回false', () => {
		expect(dateUtil.isLegalDate(null)).toEqual(false);
		expect(dateUtil.isLegalDate(undefined)).toEqual(false);
		expect(dateUtil.isLegalDate('test')).toEqual(false);
	});
});

describe('format', () => {
	it('---happly path 参数合法, 正确返回', () => {
		expect(dateUtil.format(new Date('2019/08/09'), 'YYYY/MM/DD')).toEqual('2019/08/09');
		expect(dateUtil.format(1565342511355, 'YYYY/MM/DD')).toEqual('2019/08/09');
	});
	
	it('---参数非法, 返回Invalid Date', () => {
		expect(dateUtil.format(null, 'YYYY/MM/DD')).toEqual('Invalid Date');
		expect(dateUtil.format(undefined, 'YYYY/MM/DD')).toEqual('Invalid Date');
		expect(dateUtil.format('test', 'YYYY/MM/DD')).toEqual('Invalid Date');
	});
});

describe('isSameDay', () => {
	it('---happly path 两个参数同一天时,返回true', () => {
		expect(dateUtil.isSameDay(new Date(), new Date())).toEqual(true);
	});
	
	it('---happly path 两个参数不为同一天时,返回false', () => {
		const today = new Date();
		const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);
		expect(dateUtil.isSameDay(today, yesterday)).toEqual(false);
	});
});

describe('getMonthFirstDay', () => {
	it('---happly path', () => {
		expect(dateUtil.getMonthFirstDay('2019-12', 'YYYY-MM-DD')).toEqual('2019-12-01');
	});

	it('---happly path', () => {
		expect(dateUtil.getMonthFirstDay('2019-10-26')).toEqual('2019/10/01');
	});
	
	it('---参数非法, 返回Invalid Date', () => {
		expect(dateUtil.getMonthFirstDay('test', 'YYYY/MM/DD')).toEqual('Invalid Date');
	});
});

describe('getMonthLastDay', () => {
	it('---happly path', () => {
		expect(dateUtil.getMonthLastDay('2019-12', 'YYYY-MM-DD')).toEqual('2019-12-31');
	});

	it('---happly path', () => {
		expect(dateUtil.getMonthLastDay('2019-10-26')).toEqual('2019/10/31');
	});
	
	it('---参数非法, 返回Invalid Date', () => {
		expect(dateUtil.getMonthLastDay('test', 'YYYY/MM/DD')).toEqual('Invalid Date');
	});
});

describe('abbrDateRange', () => {
	it('---happly path', () => {
		const startDate = '2019/06/01';
		const endDate = '2019/06/28';
		expect(dateUtil.abbrDateRange(startDate, endDate)).toEqual('06/01~06/28');
	});

	it('---参数非法, 返回空字符串', () => {
		const startDate1 = undefined;
		const startDate2 = null;
		const startDate3 = 'test';
		const endDate = '2019/06/28';
		expect(dateUtil.abbrDateRange(startDate1, endDate)).toEqual('');
		expect(dateUtil.abbrDateRange(startDate2, endDate)).toEqual('');
		expect(dateUtil.abbrDateRange(startDate3, endDate)).toEqual('');
	});
});

describe('parseStartDate', () => {
	it('---happly path', () => {
		const abbrDateRange = '2019/06/01~2019/07/01';
		expect(dateUtil.parseStartDate(abbrDateRange)).toEqual('2019/06/01');
	});

	it('---参数不匹配，返回空字符串', () => {
		const abbrDateRange1 = undefined;
		const abbrDateRange2 = null;
		const abbrDateRange3 = '';
		const abbrDateRange4 = 'test';
		const abbrDateRange5 = '2019/06/01';
		expect(dateUtil.parseStartDate(abbrDateRange1)).toEqual('');
		expect(dateUtil.parseStartDate(abbrDateRange2)).toEqual('');
		expect(dateUtil.parseStartDate(abbrDateRange3)).toEqual('');
		expect(dateUtil.parseStartDate(abbrDateRange4)).toEqual('');
		expect(dateUtil.parseStartDate(abbrDateRange5)).toEqual('');
	});
});

describe('parseEndDate', () => {
	it('---happly path', () => {
		const abbrDateRange = '2019/06/01~2019/07/01';
		expect(dateUtil.parseEndDate(abbrDateRange)).toEqual('2019/07/01');
	});

	it('---参数不匹配，返回空字符串', () => {
		const abbrDateRange1 = undefined;
		const abbrDateRange2 = null;
		const abbrDateRange3 = '';
		const abbrDateRange4 = 'test';
		const abbrDateRange5 = '2019/06/01';
		expect(dateUtil.parseEndDate(abbrDateRange1)).toEqual('');
		expect(dateUtil.parseEndDate(abbrDateRange2)).toEqual('');
		expect(dateUtil.parseEndDate(abbrDateRange3)).toEqual('');
		expect(dateUtil.parseEndDate(abbrDateRange4)).toEqual('');
		expect(dateUtil.parseEndDate(abbrDateRange5)).toEqual('');
	});
});

describe('getDays', () => {
	it('---happly path 开始日期小于结束日期, 返回正整数', () => {
		const startDate = '2019/06/01';
		const endDate = '2019/06/03';
		expect(dateUtil.getDays(startDate, endDate)).toEqual(2);
	});

	it('---happly path 开始日期大于结束日期, 返回负整数', () => {
		const startDate = '2019/06/06';
		const endDate = '2019/06/02';
		expect(dateUtil.getDays(startDate, endDate)).toEqual(-4);
	});

	it('---参数非法, 返回0', () => {
		const startDate = 'test';
		const endDate = '2019/06/28';
		expect(dateUtil.getDays(startDate, endDate)).toEqual(0);
	});

	it('---参数非法, 返回0', () => {
		const startDate = undefined;
		const endDate = '2019/06/28';
		expect(dateUtil.getDays(startDate, endDate)).toEqual(0);
	});

	it('---参数非法, 返回0', () => {
		const startDate = null;
		const endDate = '2019/06/28';
		expect(dateUtil.getDays(startDate, endDate)).toEqual(0);
	});
});

describe('minusDays', () => {
	it('---happly path 传入正整数n时 返回向前推n天的日期', () => {
		const baseTime = new Date('2019/05/31');
		expect(dateUtil.minusDays(baseTime, 1)).toEqual('2019/05/30');
	});

	it('---happly path 传入负数m时 返回向后推m天的日期', () => {
		const baseTime = new Date('2019/06/01');
		expect(dateUtil.minusDays(baseTime, -1)).toEqual('2019/06/02');
	});
});

describe('getRangeDates', () => {
	it('---happly path', () => {
		const startDate = new Date('2019/08/01');
		const endDate = new Date('2019/08/03');
		expect(dateUtil.getRangeDates(startDate, endDate)).toEqual(['2019/08/01', '2019/08/02', '2019/08/03']);
	});

	it('---参数不合法, 返回空数组', () => {
		const startDate1 = null;
		const startDate2 = undefined;
		const endDate = new Date('2019/08/03');
		expect(dateUtil.getRangeDates(startDate1, endDate)).toEqual([]);
		expect(dateUtil.getRangeDates(startDate2, endDate)).toEqual([]);
	});
});