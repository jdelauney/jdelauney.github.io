export default class Matrix2D {
	constructor() {
		this.matrix = [1, 0, 0, 1, 0, 0 ]
	}

	static _toRADIAN = Math.PI / 180

	static identity() {
		return [1, 0, 0, 1, 0, 0 ]
	}

	setIdentity() {
		this.matrix = Matrix2D.identity()
		return this
	}

	set(a, b, c, d, tx, ty) {
		this.matrix = [a, b, c, d, tx, ty]
		return this
	}

	get() {
		return [...this.matrix]
	}

	static multiply(matA, matB){
		// console.log('MATRIX 2D MULTIPLY ===========================================')
		// console.log("CURRENT MATRIX  = ", matA)
		// console.log("WITH MATRIX  = ", matB)
		const m0 = matA[0] * matB[0] + matA[2] * matB[1]
		const m1 = matA[1] * matB[0] + matA[3] * matB[1]
		const m2 = matA[0] * matB[2] + matA[2] * matB[3]
		const m3 = matA[1] * matB[2] + matA[3] * matB[3]
		const m4 = matA[0] * matB[4] + matA[2] * matB[5] + matA[4]
		const m5 = matA[1] * matB[4] + matA[3] * matB[5] + matA[5]
		// const m = new Matrix2D()
		// m.set(m0,m1,m2,m3,m4,m5)
		// return m;
		return [m0,m1,m2,m3,m4,m5]
	}

	multiplyBy(mat) {
		// console.log('MATRIX 2D MULTIPLY BY ===========================================')
		// console.log("MATRIX  = ", mat)
		this.matrix = Matrix2D.multiply(this.matrix, mat) //.get()
		// console.log("RESULT  = ", this.matrix)
		return this
	}

	static translation(x, y) {
		return [1, 0, 0, 1, x, y ]
	}

	static rotation(angleInDegree) {
		const c = Math.cos(angleInDegree)
		const s = Math.sin(angleInDegree)
		// const m = new Matrix2D()
		// m.set(c, s, -s, c, 0, 0 )
		// return m;
		return [c, s, -s, c, 0, 0 ]
	}

	static scaling(x,y) {
		// const m = new Matrix2D()
		// m.set(x, 0, 0, y, 0, 0 )
		// return m;
		return [x, 0, 0, y, 0, 0 ]
	}

	static skewing(angleXInDegree, angleYInDegree) {
		const radX = angleXInDegree * this._toRADIAN
		const radY = angleYInDegree * this._toRADIAN
		const tanX = Math.tan(radX)
		const tanY = Math.tan(radY)
		// const m = new Matrix2D()
		// m.set(1, tanY, tanX, 1, 0, 0)
		// return m;
		return [1, tanY, tanX, 1, 0, 0]

	}

	static copy(matFrom, matTo) {
		matTo.matrix = [...matFrom.matrix]
	}

	clone() {
		const m = new Matrix2D()
		m.matrix = [...this.matrix]
		return m;
	}

	translate(x,y) {
		// console.log('MATRIX 2D TRANSLATE ===========================================')
		const m = Matrix2D.translation(x,y)
		// console.log("MATRIX TRANSLATION = ", m)
		this.multiplyBy(m)
		return this
	}

	rotate(angleInDegree) {
		const m = Matrix2D.rotation(angleInDegree)
		this.multiplyBy(m)
		return this
	}

	scale(x,y) {
		const m = Matrix2D.scaling(x,y)
		this.multiplyBy(m)
		return this
	}

	skew(angleXInDegree, angleYinDegree) {
		const m = Matrix2D.skewing(angleXInDegree, angleYinDegree)
		this.multiplyBy(m)
		return this
	}

  rotateAround(x,y, angleInDegree) {
		this.translate(x,y).rotate(angleInDegree).translate(-x, -y)
		return this
  }
}