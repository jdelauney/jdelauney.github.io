import Point from "./Point.js";


export default class Matrix2D {
	constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
		this.initialize(a, b, c, d, tx, ty)
		this._toRadian = Math.PI/180
	}

	identity() {
		this.a = 1
		this.b = 0
		this.c = 0

		this.d = 1
		this.tx = 0
		this.ty = 0
	}

	isIdentity() {
		return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
	};


	initialize(a, b, c, d, tx, ty) {
		this.a = (a == null) ? 1 : a
		this.b = b || 0
		this.c = c || 0
		this.d = (d == null) ? 1 : d
		this.tx = tx || 0
		this.ty = ty || 0
		return this
	}

	prepend(a, b, c, d, tx, ty) {
		let tx1 = this.tx
		if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
			let a1 = this.a
			let c1 = this.c
			this.a  = a1 * a + this.b * c
			this.b  = a1 * b + this.b * d
			this.c  = c1 * a + this.d * c
			this.d  = c1 * b + this.d * d
		}
		this.tx = tx1 * a + this.ty * c + tx
		this.ty = tx1 * b + this.ty * d + ty
		return this
	}

	append (a, b, c, d, tx, ty) {
		let a1 = this.a
		let b1 = this.b
		let c1 = this.c
		let d1 = this.d

		this.a  = a * a1 + b * c1
		this.b  = a * b1 + b * d1
		this.c  = c * a1 + d * c1
		this.d  = c * b1 + d * d1
		this.tx = tx * a1 + ty * c1 + this.tx
		this.ty = tx * b1 + ty * d1 + this.ty
		return this
	}

	combine(matrices) {

		//multiple append
		let max = matrices.length;
		let mat = null;
		let a1 = this.a;
		let b1 = this.b;
		let c1 = this.c;
		let d1 = this.d;

		for (let i = 0; i < max; i++) {
			mat = matrices[i];
			this.a = mat.a * a1 + mat.b * c1
			this.b = mat.a * b1 + mat.b * d1
			this.c = mat.c * a1 + mat.d * c1
			this.d = mat.c * b1 + mat.d * d1
			this.tx = mat.tx * a1 + mat.ty * c1 + this.tx
			this.ty = mat.tx * b1 + mat.ty * d1 + this.ty

			a1 = this.a
			b1 = this.b
			c1 = this.c
			d1 = this.d
		}

		return this
	}

	prependMatrix(matrix) {
		this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty)
		return this
	}

	appendMatrix(matrix) {
		this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty)
		return this
	}

	prependTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		let r = 0
		let cos = 1
		let sin = 0

		if (rotation % 360) {
			r = rotation * this._toRadian;
			cos = Math.cos(r);
			sin = Math.sin(r);
		}

		if (regX || regY) {
			// append the registration offset:
			this.tx -= regX
			this.ty -= regY
		}

		if (skewX || skewY) {
			// TODO: can this be combined into a single prepend operation?
			skewX *= this._toRadian
			skewY *= this._toRadian
			this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
			this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
		} else {
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}
		return this;
	}

	appendTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		let r = 0
		let cos = 1
		let sin = 0

		if (rotation % 360) {
			r = rotation * this._toRadian
			cos = Math.cos(r)
			sin = Math.sin(r)
		}

		if (skewX || skewY) {
			// TODO: can this be combined into a single append?
			skewX *= this._toRadian
			skewY *= this._toRadian
			this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y)
			this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0)
		} else {
			this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y)
		}

		if (regX || regY) {
			// prepend the registration offset:
			this.tx -= regX * this.a + regY * this.c
			this.ty -= regX * this.b + regY * this.d
		}
		return this
	}

	rotate(angle) {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);

		const a1 = this.a
		const c1 = this.c
		const tx1 = this.tx

		this.a = a1 * cos - this.b * sin
		this.b = a1 * sin + this.b * cos
		this.c = c1 * cos - this.d * sin
		this.d = c1 * sin + this.d * cos
		this.tx = tx1 * cos - this.ty * sin
		this.ty = tx1 * sin + this.ty * cos
		return this
	}

	skew(skewX, skewY) {
		skewX = skewX * this._toRadian
		skewY = skewY * this._toRadian
		this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
		return this
	}

	translate(x, y) {
		this.tx += x
		this.ty += y
		return this
	}

	scale(x,y) {
		let a0 = this.a,
			  a1 = this.b,
			  a2 = this.c,
			  a3 = this.d,
			  a4 = this.tx,
			  a5 = this.ty;

		this.a = a0 * x
		this.b = a1 * x
		this.c = a2 * y
		this.d = a3 * y
		this.tx = a4
		this.ty = a5

		return this
	}

	invert() {
		const a1 = this.a
		const b1 = this.b
		const c1 = this.c
		const d1 = this.d
		const tx1 = this.tx
		const n = a1*d1-b1*c1

		this.a = d1 / n
		this.b = -b1 / n
		this.c = -c1 / n
		this.d = a1 / n
		this.tx = (c1 * this.ty - d1 * tx1) / n
		this.ty = -(a1 * this.ty - b1 * tx1) / n
		return this
	}

	decompose(target) {

		if (target == null) { target = {}; }
		target.x = this.tx;
		target.y = this.ty;
		target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
		target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

		let skewX = Math.atan2(-this.c, this.d);
		let skewY = Math.atan2(this.b, this.a);

		if (skewX === skewY) {
			target.rotation = skewY / this._toRadian
			if (this.a < 0 && this.d >= 0) {
				target.rotation += (target.rotation <= 0) ? 180 : -180
			}
			target.skewX = target.skewY = 0
		} else {
			target.skewX = skewX /  this._toRadian
			target.skewY = skewY / this._toRadian
		}
		return target
	}

	multiply(out, matrixA, matrixB) {
		let a0 = matrixA.a,
			  a1 = matrixA.b,
			  a2 = matrixA.c,
			  a3 = matrixA.d,
			  a4 = matrixA.tx,
			  a5 = matrixA.ty;
		let b0 = matrixB.a,
			  b1 = matrixB.b,
			  b2 = matrixB.c,
			  b3 = matrixB.d,
			  b4 = matrixB.tx,
			  b5 = matrixB.ty;
		out.a = a0 * b0 + a2 * b1;
		out.b = a1 * b0 + a3 * b1;
		out.c = a0 * b2 + a2 * b3;
		out.d = a1 * b2 + a3 * b3;
		out.tx = a0 * b4 + a2 * b5 + a4;
		out.ty = a1 * b4 + a3 * b5 + a5;
		return out;
	}

	transformPoint(x, y, pt) {
		pt = pt||new Point()
		pt.x = x * this.a + y * this.c + this.tx
		pt.y = x * this.b + y * this.d + this.ty
		return pt
	}

	setFrom(matrix) {
		return this.initialize(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty)
	}

	clone() {
		return (new Matrix2D()).setFrom(this);
	}
}