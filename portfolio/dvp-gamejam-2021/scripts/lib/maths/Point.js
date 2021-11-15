import MathUtils from "./MathUtils.js";

export default class Point {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}

	translate(x,y) {
		this.x += x
		this.y += y
	}

	translateX(x) {
		this.x += x
	}

	translateY(y) {
		this.y += y
	}

	rotateAround(axis, angle) {
		const a = angle * MathUtils.toRADIAN
		const s = Math.sin(a)
		const c = Math.cos(a)
		const px = axis.x - this.x
		const py = axis.y - this.y

		this.x = (px * c) + (py * s) + axis.x;
		this.y = (-px * s) + (py * c) + axis.y;
	}

	rotate(angle) {
		const a = angle * MathUtils.toRADIAN
		const s = Math.sin(a)
		const c = Math.cos(a)

		this.x = (this.x * c) + (this.y * s);
		this.y = (-this.x * s) + (this.y * c);
	}
}