export class DateUtil {
	oneDayMills = 60 * 60 * 1000 * 24;
	yesterday = this.daysAgo(1);

	constructor() {}

	format(time, formatType) {
		const t = new Date(time);
		if (!time || t == 'Invalid Date' || !formatType) {
			return 'Invalid Date';
		}
		const getFull = (i) => {
			return (i < 10 ? '0' : '') + i;
		};
		return formatType.replace(/YYYY|MM|DD|HH|mm|ss/g, (a) => {
			switch (a) {
				case 'YYYY':
					return getFull(t.getFullYear());
					break;
				case 'MM':
					return getFull(t.getMonth() + 1);
					break;
				case 'DD':
					return getFull(t.getDate());
					break;
				case 'HH':
					return getFull(t.getHours());
					break;
				case 'mm':
					return getFull(t.getMinutes());
					break;
				case 'ss':
					return getFull(t.getSeconds());
					break;
			}
		})
	};

	isLegalDate(date) {
		if (!date || this.format(date, 'YYYY/MM/DD') === 'Invalid Date') {
			return false;
		}
		return true;
	}

	isSameDay(date1, date2) {
		if (this.isLegalDate(date1) && this.isLegalDate(date2)) {
			return this.format(date1, 'YYYY/MM/DD') === this.format(date2, 'YYYY/MM/DD');
		}
		return false;
	}

	daysAgo(days) {
		days = days ? days : 0;
		const timestamp = Date.now() - this.oneDayMills * days;
		return this.format(timestamp, 'YYYY/MM/DD');
	}

	getMonthFirstDay(date, formatType = 'YYYY/MM/DD') {
		date = new Date(date);
		const month = date.getMonth();
		const year = date.getFullYear();
		const firstDay = new Date(year, month, 1);
		return this.format(firstDay, formatType);
	}

	getMonthLastDay(date, formatType = 'YYYY/MM/DD') {
		date = new Date(date);
		const nextMonth = date.getMonth() + 1;
		const year = date.getFullYear();
		const lastDay = new Date(year, nextMonth, 0);
		return this.format(lastDay, formatType);
	}

	abbrDateRange(startDate, endDate) {
		const startDateFormat = this.format(startDate, 'YYYY/MM/DD');
		const endDateFormat = this.format(endDate, 'YYYY/MM/DD');
		if (this.isLegalDate(startDate) && this.isLegalDate(endDate)) {
			const start = startDateFormat.slice(5);
			const end = endDateFormat.slice(5);
			return start + '~' + end;
		}
		return '';
	}

	parseStartDate(abbrDateRange) {
		if (!abbrDateRange || abbrDateRange.indexOf('~') === -1) {
			return '';
		}
		let startDate = abbrDateRange.split('~')[0];
		return this.isLegalDate(startDate) ? startDate : '';
	}

	parseEndDate(abbrDateRange) {
		if (!abbrDateRange || abbrDateRange.indexOf('~') === -1) {
			return '';
		}
		let endDate = abbrDateRange.split('~')[1];
		return this.isLegalDate(endDate) ? endDate : '';
	}

	getDays(startDate, endDate) {
		if (this.isLegalDate(startDate) && this.isLegalDate(endDate)) {
			return Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / this.oneDayMills);
		}
		return 0;
	}

	minusDays(date, days) {
		days = days ? days : 0;
		return this.format(new Date(date).getTime() - this.oneDayMills * days, 'YYYY/MM/DD');
	}

	addDays(date, days) {
		days = days ? days : 0;
		return this.format(new Date(date).getTime() + this.oneDayMills * days, 'YYYY/MM/DD');
	}

	getRangeDates(startDate, endDate) {
		let dates = [];
		if (this.isLegalDate(startDate) && this.isLegalDate(endDate)) {
			let date = new Date(startDate).getTime();
			const endTimestamp = new Date(endDate).getTime();
			while (date <= endTimestamp) {
				dates.push(this.format(date, 'YYYY/MM/DD'));
				date += this.oneDayMills;
			}
		}
		return (dates);
	}
}