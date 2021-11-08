export default class MathUtils {
	constructor() {
	}

	static PI2 = Math.PI * 2
	static toRADIAN = Math.PI / 180
	static toDEGREE = 180 / Math.PI

	static randomRange(min=10, max=30) {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	static clamp(value, min, max) {
		if (value > max) {
			return max
		}
		if (value < min) {
			return min
		}
		return value
	}

	static clampMin(value, min) {
		if (value < min ) {
			return min
		}
		return value
	}

	static lerp( start, end, delta ) {
		return start + ( ( end - start ) * delta );
	}

	static angleBetweenPoints(x1, y1, x2, y2) {
		return Math.atan2( y2 - y1, x2 - x1 ) * MathUtils.toDEGREE;
	}
}