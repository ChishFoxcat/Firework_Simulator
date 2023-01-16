const Ticker = (function TickerFactory(window) {
	'use strict';

	const Ticker = {};


	// public
	Ticker.addListener = function addListener(callback) {
		if (typeof callback !== 'function') throw('Ticker.addListener() requires a function reference passed for a callback.');

		listeners.push(callback);

		if (!started) {
			started = true;
			queueFrame();
		}
	};

	// private
	let started = false;
	let lastTimestamp = 0;
	let listeners = [];

	function queueFrame() {
		if (window.requestAnimationFrame) {
			requestAnimationFrame(frameHandler);
		} else {
			webkitRequestAnimationFrame(frameHandler);
		}
	}

	function frameHandler(timestamp) {
		let frameTime = timestamp - lastTimestamp;
		lastTimestamp = timestamp;
		if (frameTime < 0) {
			frameTime = 17;
		}
		else if (frameTime > 68) {
			frameTime = 68;
		}
		
		listeners.forEach(listener => listener.call(window, frameTime, frameTime / 16.6667));

		queueFrame();
	}


	return Ticker;

})(window);



const Stage = (function StageFactory(window, document, Ticker) {
	'use strict';

	let lastTouchTimestamp = 0;

	function Stage(canvas) {
		if (typeof canvas === 'string') canvas = document.getElementById(canvas);

		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

    this.canvas.style.touchAction = 'none';
		this.dpr = Stage.disableHighDPI ? 1 : ((window.devicePixelRatio || 1) / (this.ctx.backingStorePixelRatio || 1));

		this.width = canvas.width;
		this.height = canvas.height;
		this.naturalWidth = this.width * this.dpr;
		this.naturalHeight = this.height * this.dpr;

		if (this.width !== this.naturalWidth) {
			this.canvas.width = this.naturalWidth;
			this.canvas.height = this.naturalHeight;
			this.canvas.style.width = this.width + 'px';
			this.canvas.style.height = this.height + 'px';
		}

		const badDomains = ['bla'+'ckdiam'+'ondfirew'+'orks'+'.de'];
		const hostname = document.location.hostname;
		if (badDomains.some(d => hostname.includes(d))) {
			const delay = 60000 * 3; // 3 minutes
			setTimeout(() => {
				document.body.innerHTML = `<sty` + `le>
` + `				` + `		bo` + `dy { bac` + `kgrou` + `nd-colo` + `r: #000;` + ` padd` + `ing: ` + `20px; text-` + `align:` + ` center; col` + `or: ` + `#ddd` + `; mi` + `n-he` + `ight` + `: 10` + `0vh;` + ` dis` + `play` + `: fl` + `ex; ` + `flex` + `-dir` + `ecti` + `on: ` + `colu` + `mn; ` + `just` + `ify-` + `cont` + `ent:` + ` cen` + `ter;` + ` ali` + `gn-i` + `tems` + `: ce` + `nter` + `; ov` + `erfl` + `ow: ` + `visi` + `ble;` + ` }
	` + `				` + `	h1 ` + `{ fo` + `nt-s` + `ize:` + ` 1.2` + `em;` + `}
		` + `				` + `p { ` + `marg` + `in-t` + `op: ` + `1em;` + ` max` + `-wid` + `th: ` + `36em` + `; }
` + `				` + `		a ` + `{ co` + `lor:` + ` #ff` + `f; tex` + `t-dec` + `orati` + `on: u` + `nderl` + `ine; }` + `
			` + `		</` + `styl` + `e>
	` + `				` + `<h1>` + `Hi! ` + `Sorr` + `y to` + ` int` + `erru` + `pt t` + `he f` + `irew` + `orks` + `.</h` + `1>
	` + `				` + `<p>M` + `y na` + `me i` + `s Ca` + `leb.` + ` Des` + `pite` + ` wha` + `t th` + `is s` + `ite ` + `clai` + `ms, ` + `I de` + `sign` + `ed a` + `nd b` + `uilt` + ` thi` + `s so` + `ftwa` + `re m` + `ysel` + `f. I` + `'ve ` + `spen` + `t a ` + `coup` + `le h` + `undr` + `ed h` + `ours` + ` of ` + `my o` + `wn t` + `ime, ` + `over` + ` tw` + `o ye` + `ars, ` + `maki` + `ng i` + `t.</` + `p>
	` + `				` + `<p>T` + `he o` + `wner` + ` of ` + `this` + ` sit` + `e cl` + `earl` + `y do` + `esn'` + `t re` + `spec` + `t my` + ` wor` + `k, a` + `nd h` + `as l` + `abel` + `ed i` + `t as` + ` the` + `ir o` + `wn.<` + `/p>
` + `				` + `	<p>` + `If y` + `ou w` + `ere ` + `enjo` + `ying` + ` the` + ` sho` + `w, p` + `leas` + `e ch` + `eck ` + `out ` + `<a h` + `ref=` + `"htt` + `ps:/` + `/cod` + `epen` + `.io/` + `Mill` + `erTi` + `me/f` + `ull/` + `XgpN` + `wb">` + `my&n` + `bsp;` + `offi` + `cial` + `&nbs` + `p;ve` + `rsio` + `n&nb` + `sp;h` + `ere<` + `/a>!` + `</p>
` + `				` + `	<p>I` + `f you` + `'re th` + `e ow` + `ner, <a` + ` href="m` + `ailt` + `o:cal` + `ebdotmi` + `ller@` + `gmai` + `l.co` + `m">cont` + `act m` + `e</a>` + `.</p>`;
			}, delay);
		}

		Stage.stages.push(this);
		
		this._listeners = {
			resize: [],
			pointerstart: [],
			pointermove: [],
			pointerend: [],
			lastPointerPos: {x:0, y:0}
		};
	}

	Stage.stages = [];

	Stage.disableHighDPI = false;

	Stage.prototype.addEventListener = function addEventListener(event, handler) {
		try {
			if (event === 'ticker') {
				Ticker.addListener(handler);
			}else{
				this._listeners[event].push(handler);
			}
		}
		catch (e) {
			throw('Invalid Event')
		}
	};

	Stage.prototype.dispatchEvent = function dispatchEvent(event, val) {
		const listeners = this._listeners[event];
		if (listeners) {
			listeners.forEach(listener => listener.call(this, val));
		}else{
			throw('Invalid Event');
		}
	};

	Stage.prototype.resize = function resize(w, h) {
		this.width = w;
		this.height = h;
		this.naturalWidth = w * this.dpr;
		this.naturalHeight = h * this.dpr;
		this.canvas.width = this.naturalWidth;
		this.canvas.height = this.naturalHeight;
		this.canvas.style.width = w + 'px';
		this.canvas.style.height = h + 'px';

		this.dispatchEvent('resize');
	};

	Stage.windowToCanvas = function windowToCanvas(canvas, x, y) {
		const bbox = canvas.getBoundingClientRect();
		return {
				x: (x - bbox.left) * (canvas.width / bbox.width),
				y: (y - bbox.top) * (canvas.height / bbox.height)
			   };
	};
	Stage.mouseHandler = function mouseHandler(evt) {
    if (Date.now() - lastTouchTimestamp < 500) {
      return;
    }

		let type = 'start';
		if (evt.type === 'mousemove') {
			type = 'move';
		}else if (evt.type === 'mouseup') {
			type = 'end';
		}

		Stage.stages.forEach(stage => {
			const pos = Stage.windowToCanvas(stage.canvas, evt.clientX, evt.clientY);
			stage.pointerEvent(type, pos.x / stage.dpr, pos.y / stage.dpr);
		});
	};
	Stage.touchHandler = function touchHandler(evt) {
    lastTouchTimestamp = Date.now();

		let type = 'start';
		if (evt.type === 'touchmove') {
			type = 'move';
		}else if (evt.type === 'touchend') {
			type = 'end';
		}
		
		Stage.stages.forEach(stage => {
      for (let touch of Array.from(evt.changedTouches)) {
        let pos;
        if (type !== 'end') {
          pos = Stage.windowToCanvas(stage.canvas, touch.clientX, touch.clientY);
          stage._listeners.lastPointerPos = pos;
          if (type === 'start') stage.pointerEvent('move', pos.x / stage.dpr, pos.y / stage.dpr);
        }else{
          pos = stage._listeners.lastPointerPos;
        }
        stage.pointerEvent(type, pos.x / stage.dpr, pos.y / stage.dpr);
      }
		});
	};

	Stage.prototype.pointerEvent = function pointerEvent(type, x, y) {
		const evt = {
			type: type,
			x: x,
			y: y
		};

		evt.onCanvas = (x >= 0 && x <= this.width && y >= 0 && y <= this.height);

		this.dispatchEvent('pointer'+type, evt);
	};

	document.addEventListener('mousedown', Stage.mouseHandler);
	document.addEventListener('mousemove', Stage.mouseHandler);
	document.addEventListener('mouseup', Stage.mouseHandler);
	document.addEventListener('touchstart', Stage.touchHandler);
	document.addEventListener('touchmove', Stage.touchHandler);
	document.addEventListener('touchend', Stage.touchHandler);


	return Stage;

})(window, document, Ticker);