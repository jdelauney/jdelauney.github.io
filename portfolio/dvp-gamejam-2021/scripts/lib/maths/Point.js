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

}