import AbstractGameObject from "../lib/core/GameObject.js";
import Point from "../lib/maths/Point.js";
import Circle from "./Circle.js";

export default class Player extends AbstractGameObject {
	constructor(position) {
		super();
		this.translation = position
		this.position = new Point(0,0)
		this.size = 20
		this.width = this.size
		this.height = this.size
		this.init()

		this._PI2 = Math.PI * 2
	}

	init(){
		let eyeRight = new Circle(new Point(8,  - 2), 10,'black')
		let eyeRightInner = new Circle(new Point(5,  -1), 4,'white')

		let eyeLeft= new Circle(new Point(-8,  - 2), 10,'black')
		let eyeLeftInner = new Circle(new Point(-5,  -1), 4,'white')

		eyeLeft.setParent(this)
		eyeRight.setParent(this)
		eyeLeftInner.setParent(this)
		eyeRightInner.setParent(this)

		this.shadow = {offsetX: 0, offsetY: 0, blur:30, color:"#999999"}

		//this.engine.cadencer.on("cadencerProgress", this.animate.bind(this))
		this.translationOld = new Point(this.translation.x,this.translation.y)

		this.direction = new Point(((Math.random() * 2) -1), ((Math.random() * 2) -1))
	}

	animate(deltaTime,currentTime, elapsedTime) {

		// this.context.resetTransform()
		// this.translation.x = this.translationOld.x
		// this.translation.y = this.translationOld.y
		//console.log('BEFORE ===> ', this.translation)
		// let dt = currentTime;
		// this.offset = new Point( 7 * Math.sin(this._PI2 * dt * 0.288 + 25), 8 * Math.cos(this._PI2 * dt * .236 + 35))
		// this.direction.x = -this.direction.x
		// this.direction.y = -this.direction.y

		//console.log('OFFSET ===> ', offset)

		// this.translation.x += offset.x
		// this.translation.y += offset.y

		// this.translationOld.x = this.translation.x
		// this.translationOld.y = this.translation.y

		//console.log('AFTER ===> ', this.translation)

		//this.matrix.translate(-this.position.x, -this.position.y).rotate(this.rotation).translate(this.position.x, this.position.y)
	}

	draw() {
		this.context.beginPath()
		this.context.arc(0,0,this.size,0,this._PI2, false)
		this.context.fillStyle = "#ec3a49"
		this.context.fill()
		//this.translation = this.translationOld
	}
}