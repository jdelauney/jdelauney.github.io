import EventEmitter from "../utils/EventEmitter.js";
import Matrix2D from "../maths/Matrix2D.js";
import SceneGraph from "./SceneGraph.js";
import Point from "../maths/Point.js";
import MathUtils from "../maths/MathUtils.js";

export default class AbstractGameObject extends EventEmitter {
	constructor(name='NO NAME', position = new Point(0,0), width = 0, height = 0, shadow = null) {
		super()

		if (this.constructor === AbstractGameObject) {
			throw new TypeError("The abstract class 'AbstractGameObject' cannot be instantiated directly")
		}

		this.engine = window.gameengine
		this.renderer =this.engine.renderer
		this.context = this.renderer.context

    this.name = name

		this.width = width
		this.height = height
		this.originalWidth = width
		this.originalHeight = height

		//this.position = new Point(0,0)
		this.translation = new Point(position.x, position.y)

		this.rotation = 0
		this.rotationAroundAxis = false
		this.rotationAxis = new Point(0.5, 0.5)

		this.scaling = new Point(1,1)
		this.skewing = new Point(0,0)

		this.alpha = 1
		this.visible = true;

		// this.localMatrix = new Matrix2D()
		// this.worldMatrix = new Matrix2D()

		this.shadow = shadow

		this.parent = null;
		this.child = new SceneGraph()
	}

	setParent(parentNode) {
		if (this.parent) {
			let ndx =  this.parent.child.children.indexOf(this)
			if (ndx >= 0) {
				this.parent.child.children.splice(ndx, 1)
			}
		}

		if (parentNode) {
			parentNode.child.children.push(this)
		}
		this.parent = parentNode
	}

	translate(x,y) {
		this.translation.x += x
		this.translation.y += y
		return this
	}

	rotate(angleInDegree) {
		this.rotation += angleInDegree
		return this
	}

	scale(x,y) {
		this.scaling.x += x
		this.scaling.y += y
		this.width = this.originalWidth * x
		this.height = this.originalHeight * y
		return this
	}

	// skew(angleXInDegree, angleYInDegree) {
	// 	this.localMatrix.skew(angleXInDegree, angleYInDegree)
	// 	return this
	// }
	//
	// rotateAround(angleInDegree, rotateAxis) {
	// 	this.localMatrix.rotateAround(rotateAxis.x, rotateAxis.y, angleInDegree)
	// 	return this
	// }

	updateMatrixTransformation() {

		  this.context.translate(this.translation.x, this.translation.y)
		  this.context.scale(this.scaling.x, this.scaling.y)

		  if (this.rotationAroundAxis) {
			  // this.context.translate(-this.translation.x, -this.translation.y);
			  // this.context.rotate(this.rotation * MathUtils.toRADIAN);
			  // this.context.translate(this.translation.x, this.translation.y);
			  this.context.translate(-this.rotationAxis.x, -this.rotationAxis.y);
			  this.context.rotate(this.rotation * MathUtils.toRADIAN);
			  this.context.translate(this.rotationAxis.x, this.rotationAxis.y);
		  }
			else {
			  this.context.rotate(this.rotation * MathUtils.toRADIAN);
		  }
	}

	applyShadow() {
		if (this.shadow) {
			this.context.shadowOffsetX = this.shadow.offsetX
			this.context.shadowOffsetY = this.shadow.offsetY
			this.context.shadowBlur = this.shadow.blur
			this.context.shadowColor = this.shadow.color
		}
	}

  update() {
	  this.updateMatrixTransformation()
	  this.applyShadow()
  }

	addChild(child) {
		this.child.addChild(child)
		child.parent = this;
	}

	hasChildren() {
		return (this.child.count() > 0)
  }

	render() {

		if( this.visible === false ) {
			return
		}

		this.context.save()
		this.context.globalAlpha = this.alpha

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