let LOADING_POINT_TIMER = null;
let NEXT_YEAR_TIMER = null;
let NEXT_YEAR_TIME_YEAR = 2023;
let NEXT_YEAR_TIME_MONTH = 1;
let NEXT_YEAR_TIME_DAY = 22;
let NOW_TIME_TIMER = null;

function setLoadingPoint() {
	const point = document.querySelector("#loading-init__point");
	LOADING_POINT_TIMER = setInterval(() => {
		if (point.textContent.length >= 3) {
			point.textContent = "";
		} else {
			point.textContent += '.';
		}
	}, 500);
}
setTimeout(() => setLoadingPoint(), 10);

function nextNewYearTime() {
	let newYear = new Date(
		NEXT_YEAR_TIME_YEAR,
		NEXT_YEAR_TIME_MONTH <= 0 ? 0 : NEXT_YEAR_TIME_MONTH - 1,
		NEXT_YEAR_TIME_DAY
	);

	function pad(num) {
		return num.toString().padStart(2, '0');
	}

	function _getNewYearTime() {
		const now = new Date();
		const diff = newYear.getTime() - now.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);

		return `<div>
           	<span style="display: inline-block;font-size: 20px;margin-left: 5px;margin-bottom: 10px">倒计时</span><br>
           	<span style="display: inline-block;margin-left: 5px">距离<span style="background: linear-gradient(to left, #F44336, #FF9800);-webkit-background-clip: text;color: transparent;text-shadow: none;"> ${NEXT_YEAR_TIME_YEAR} </span>
           	春节还有</span><div style="font-size: 30px;text-align: center"><span style="font-size: 60%">${pad(days)}天</span>&nbsp;${pad(hours)}:${pad(minutes)}:${pad(seconds)}</div></div>`;
	}

	function _set() {
		 const now = new Date();
		 const nextYearDOM = document.querySelector('#Next-Year-Time');
		 if (now.getTime() >= newYear.getTime()) {
			 // 计算一天有多少毫秒
			 if(now.getTime() - newYear.getTime() < 1000 * 60 * 60 * 24) {
				 nextYearDOM.innerHTML = `<div style="width: 175px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, calc(-50% - 3px));"><span style="background: linear-gradient(to left, #F44336, #FF9800);-webkit-background-clip: text;color: transparent;text-shadow: none;">${NEXT_YEAR_TIME_YEAR} 年春节快乐！</span>🎉</div>`;
			 } else {
				 const lunar = calendar.lunar2solar(now.getFullYear() + 1, 1, 1);
				 newYear = new Date(
					 lunar.cYear,
					 lunar.cMonth,
					 lunar.cDay
				 );
				 NEXT_YEAR_TIME_YEAR = lunar.cYear;
				 NEXT_YEAR_TIME_MONTH = lunar.cMonth;
				 NEXT_YEAR_TIME_DAY = lunar.cDay;
				 nextYearDOM.innerHTML = _getNewYearTime();
			 }
		 } else {
			 nextYearDOM.innerHTML = _getNewYearTime();
		 }
	}
	_set();

	NEXT_YEAR_TIMER = setInterval(() => _set(), 1000);
}
setTimeout(() => nextNewYearTime(), 0);

function nowTime() {
	function pad(num) {
		return num.toString().padStart(2, '0');
	}

	function _getMonthFullName(month) {
		const monthFullName = [
			'January',  'February', 'March',    'April',
			'May',      'June',     'July',     'August',
			'September','October',  'November', 'December'
		];
		return monthFullName[month];
	}

	function _getWeekFullName(week) {
		const weekFullName = [
			'Sunday', 'Monday', 'Tuesday', 'Wednesday',
			'Thursday', 'Friday', 'Saturday'
		];
		return weekFullName[week];
	}

	function _set() {
		const now = new Date();
		const timeDom = document.querySelector('#Now-Time .time');
		const dateDom = document.querySelector('#Now-Time .date');
		timeDom.innerHTML = `${pad(now.getHours())} : ${pad(now.getMinutes())}<span> : ${pad(now.getSeconds())}</span>`;
		dateDom.textContent = `${_getWeekFullName(now.getDay())} , ${_getMonthFullName(now.getMonth())}${pad(now.getDate())} , ${now.getFullYear()}`;
	}
	_set();

	NOW_TIME_TIMER = setInterval(() => _set(), 1000);
}
setTimeout(() => nowTime(), 0);

function setBottomRightButton(toggleMenu) {
	document.querySelector("#right-bottom-button .parent-button").addEventListener("click", toggleMenu);
}
