import AbstractGameObject from "../lib/core/GameObject.js";
import Circle from "./Circle.js";
import Point from "../lib/maths/Point.js";

export default class CheckPoint extends AbstractGameObject {
	constructor(position, radius = 0) {
		super();
		this.translation = position
		this.size = 40 + radius
		this.width = this.size
		this.height = this.size

		this.init()
	}

	init(){
		this.color = 'white'

		const circlePos1 = new Point(0,  - this.size)
		let circle1 = new Circle(circlePos1, 5,'white')
		// this.circle1.rotateAxisX = this.position.x
		// this.circle1.rotateAxisY = this.position.y
		const circlePos2 = new Point(0,  + this.size)
		let circle2 = new Circle(circlePos2, 5,'white')
		// this.circle2.rotateAxisX = this.position.x
		// this.circle2.rotateAxisY = this.position.y
		circle1.setParent(this)
		circle2.setParent(this)

		// this.rotation = 1  * this._toRadians;
		// this.globalRotation = 10 // * this._toRadians;
		// this.rotateAxis.x = 0 //this.position.x;
		// this.rotateAxis.y = 0 //this.position.y;

		//this.engine.cadencer.on("cadencerProgress", this.animate.bind(this))
	}

	animate(deltaTime,currentTime, elapsedTime) {
		this.rotation += 1.0
		//this.matrix.translate(-this.position.x, -this.position.y).rotate(this.rotation).translate(this.position.x, this.position.y)
	}



	draw() {
		//this.updating()

		//this.matrix.translate(this.engine.viewport.width * 0.5,this.engine.viewport.height * 0.5)
			//.rotate(this.rotation).translate(-this.position.x, -this.position.y)
		//this.matrix.translate(this.engine.viewport.width * 0.5,this.engine.viewport.height * 0.5).rotate(this.rotation).translate(-this.engine.viewport.width * 0.5,-this.engine.viewport.height * 0.5)
		//this.context.translate(this.engine.viewport.width * 0.5,this.engine.viewport.height * 0.5)
		 //this.context.translate(this.position.x,this.position.y)
		 // this.context.rotate(this.rotation)
		 // this.context.translate(-this.position.x,-this.position.y)

		this.context.beginPath()
		this.context.arc(0,0,this.size,0,this._PI2, false)
		this.context.strokeWidth = 50
		this.context.strokeStyle = this.color
		this.context.stroke()
	}
}