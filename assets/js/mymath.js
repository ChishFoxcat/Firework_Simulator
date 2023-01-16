const Mymath = (function MyMathFactory(Math) {

	const MyMath = {};


	MyMath.toDeg = 180 / Math.PI;
	MyMath.toRad = Math.PI / 180;
	MyMath.halfPI = Math.PI / 2;
	MyMath.twoPI = Math.PI * 2;

	MyMath.dist = (width, height) => {
		return Math.sqrt(width * width + height * height);
	};

	MyMath.pointDist = (x1, y1, x2, y2) => {
		const distX = x2 - x1;
		const distY = y2 - y1;
		return Math.sqrt(distX * distX + distY * distY);
	};

	MyMath.angle = (width, height) => ( MyMath.halfPI + Math.atan2(height, width) );

	MyMath.pointAngle = (x1, y1, x2, y2) => ( MyMath.halfPI + Math.atan2(y2 - y1, x2 - x1) );

	MyMath.splitVector = (speed, angle) => ({
		x: Math.sin(angle) * speed,
		y: -Math.cos(angle) * speed
	});

	MyMath.random = (min, max) => Math.random() * (max - min) + min;

	MyMath.randomInt = (min, max) => ((Math.random() * (max - min + 1)) | 0) + min;

	MyMath.randomChoice = function randomChoice(choices) {
		if (arguments.length === 1 && Array.isArray(choices)) {
			return choices[(Math.random() * choices.length) | 0];
		}
		return arguments[(Math.random() * arguments.length) | 0];
	};

	MyMath.clamp = function clamp(num, min, max) {
		return Math.min(Math.max(num, min), max);
	};


	return MyMath;

})(Math);