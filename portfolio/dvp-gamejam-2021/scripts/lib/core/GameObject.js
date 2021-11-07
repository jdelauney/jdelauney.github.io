import EventEmitter from "../utils/EventEmitter.js";
import Matrix2D from "../maths/Matrix2D.js";
import SceneGraph from "./SceneGraph.js";
import Point from "../maths/Point.js";

export default class AbstractGameObject extends EventEmitter {
	constructor() {
		super()

		if (this.constructor === AbstractGameObject) {
			throw new TypeError("The abstract class 'AbstractGameObject' cannot be instantiated directly")
		}
		this._toRadians = Math.PI / 180;
    this.name ='NONAME'
		this.engine = window.gameengine
		this.renderer =this.engine.renderer
		this.context = this.renderer.context
		this.width = 0
		this.height = 0

		//this.position = new Point(0,0)
		this.translation = new Point(0,0)

		this.rotation = 0
		this.rotationAroundCenter = false
		this.rotationCenter = new Point(0.5, 0.5)

		this.scaling = new Point(1,1)
		this.skewing = new Point(0,0)

		this.alpha = 1
		this.visible = true;

		// this.localMatrix = new Matrix2D()
		// this.worldMatrix = new Matrix2D()
		this.shadow = null

		this.parent = null;
		this.child = new SceneGraph()

		this._PI2 = Math.PI * 2
	}

	setRotationAxisToCenter() {
		this.RotateAxisX = this.width * 0.5
		this.RotateAxisY = this.height * 0.5
	}


	computeWorldMatrix(currentNode, parentWorldMatrix){
		//let parentWorldMatrix = (this.parent !== null) ? this.parent.worldMatrix : Matrix2D.identity
		let wm = Matrix2D.multiply(parentWorldMatrix, currentNode.localMatrix)

		if (this.hasChildren()) {
			this.child.children.forEach((child) => {
				this.computeWorldMatrix(child, wm)
			})
		}
	}

	updateWorldMatrix(parent) {
		if (parent) {
			this.localMatrix = Matrix2D.multiply(parent.worldMatrix, this.localMatrix)
		}
		else {
			Matrix2D.copy(this.localMatrix, this.worldMatrix)
		}

		let wm = this
		this.child.children.forEach((child) => {
			child.updateWorldMatrix(wm)
		})
	}

	setParent(parentNode) {
		// if (this.parent) {
		// 	let ndx =  this.parent.child.children.indexOf(this)
		// 	if (ndx >= 0) {
		// 		this.parent.child.children.splice(ndx, 1)
		// 	}
		// }

		if (parentNode) {
			parentNode.child.children.push(this)
		}
		this.parent = parentNode
	}

	translate(x,y) {
		//console.log('GAME OBJECT TRANSLATE ===========================================')
		this.localMatrix.translate(x,y)
		//console.log("LOCAL MATRIX = ", this.localMatrix)
		return this
	}

	rotate(angleInDegree) {
		this.localMatrix.rotate(angleInDegree)
		return this
	}

	scale(x,y) {
		this.localMatrix.scale(x,y)
		return this
	}

	skew(angleXInDegree, angleYInDegree) {
		this.localMatrix.skew(angleXInDegree, angleYInDegree)
		return this
	}

	rotateAround(angleInDegree, rotateAxis) {
		this.localMatrix.rotateAround(rotateAxis.x, rotateAxis.y, angleInDegree)
		return this
	}

	updateMatrixTransformation() {
		// if (this.parent) {
		// 	this.computeWorldMatrix(this, this.parent.worldMatrix)
		// }
		// else {
		// 	let im = new Matrix2D()
		// 	this.computeWorldMatrix(this, im)
		// }
			//let mt = new Matrix2D()

		// this.position.x = 0
		// this.position.y = 0

		// this.position.x = this.translation.x
		// this.position.y = this.translation.y
		// console.log("CURRENT TRANSLATION = ", this.position)
		// //console.log("PARENT === ", this.parent)
		// if (this.parent !== null) {
		// 	console.log("PARENT TRANSLATION = ", this.parent.translation)
		// 	this.position.x = this.parent.position.x + this.translation.x
		// 	this.position.y = this.parent.position.y + this.translation.y
		// }
		// console.log("NEW TRANSLATION = ", this.position)

		//console.log("DRAW AT = ", this.translation)

			  //.skew(this.skewing.x, this.skewing.y).rotate(this.rotation).scale(this.scaling.x, this.scale.y)
		  //mt.translate(this.translation.x, this.translation.y).skew(this.skewing.x, this.skewing.y).rotate(this.rotation).scale(this.scaling.x, this.scale.y)

      //this.updateWorldMatrix(this.parent.worldMatrix)
		  //this.localMatrix.setIdentity()
		  //this.translate(this.translation.x, this.translation.y)

		  ////let mt = Matrix2D.multiply(this.worldMatrix, this.localMatrix)
		  //let mt = this.worldMatrix.clone();
		  //let mt = this.localMatrix
			//console.log(mt)
		  //mt.translate(this.engine.viewport.width * 0.5,this.engine.viewport.height * 0.5,)
		  //mt.multiplyBy(this.localMatrix)
		  //this.context.setTransform(mt[0], mt[1], mt[2], mt[3], mt[4], mt[5])
		  //this.context.translate(this.position.x, this.position.y)

		  if (this.shadow) {
				this.context.shadowOffsetX = this.shadow.offsetX
			  this.context.shadowOffsetY = this.shadow.offsetY
			  this.context.shadowBlur = this.shadow.blur
			  this.context.shadowColor = this.shadow.color
		  }

		  this.context.translate(this.translation.x, this.translation.y)
		  this.context.scale(this.scaling.x, this.scaling.y)

		  if (this.rotationAroundCenter) {
			  // this.context.translate(this.engine.viewport.width * this.rotationCenter.x, this.engine.viewport.height * this.rotationCenter.y);
			  // this.context.rotate(this.rotation * this._toRadians);
			  // this.context.translate(-this.engine.viewport.width * this.rotationCenter.x, -this.engine.viewport.height * this.rotationCenter.y);
			  this.context.translate(-this.translation.x, -this.translation.y);
			  this.context.rotate(this.rotation * this._toRadians);
			  this.context.translate(this.translation.x, this.translation.y);
		  }
			else {
			  this.context.rotate(this.rotation * this._toRadians);
		  }

	}

  update() {
	  this.updateMatrixTransformation()
  }

	addChild(child) {
		this.child.addChild(child)
		child.parent = this;
	}

	hasChildren() {
		return (this.child.count() > 0)
  }

	render() {
		//console.log("Render Game Object == ", this.name)

		if( this.visible === false ) {
			return
		}

		//let mat = this.matrix
		this.context.save()
		this.context.globalAlpha = this.alpha

		// const xAX = Math.cos(this.rotation) * this.scale.x;
		// const xAY = Math.sin(this.rotation) * this.scale.y;
		// this.context.transform(xAX, xAY, -xAY, xAX, 0, 0);

		// this.context.scale(this.scale.x, this.scale.y)
		// this.context.skew(this.skew.x, this.skew.y)
		// this.context.translate(this.rotateAxis.x, this.rotateAxis.y)
		// this.context.rotate(this.rotation * this._toRadians)
		// this.context.translate(-this.rotateAxis.x, -this.rotateAxis.y)
		//this.context.translate(this.position.x, this.position.y)
		//this.context.resetTransform()
		//this.context.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty)

		this.update()
		this.draw()

		if (this.hasChildren()) {
			this.child.render()
		}

		this.context.restore()
	}

	hitTest(x,y){
		if(this.matrix == null ) {
			this.update()
		}

		//const pt1 = this.globalToLocal(x,y)
		const pt1 = new Point(0,0)

		return !(pt1.x < 0 || pt1.x > this.width || pt1.y < 0 || pt1.y > this.height);
	}

	draw() {
		throw new Error("You need to implement this method in children");
	}


}