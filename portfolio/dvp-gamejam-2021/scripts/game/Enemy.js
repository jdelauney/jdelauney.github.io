import AbstractGameObject from "../lib/core/GameObject.js";
import Circle from "./Circle.js";
import Point from "../lib/maths/Point.js";

export default class Enemy extends AbstractGameObject {
	constructor(position, scaleFactor) {
		super();
		this.translation = position
		this.size = 20;
		this.scaling.x = scaleFactor
		this.scaling.y = scaleFactor

		this.init()
	}

	init(){
		this.body = new Circle(new Point(0,0), this.size, "#131418")
		// this.body.scaling.x = this.scaling.x
		// this.body.scaling.y = this.scaling.y

		let eyeRight = new Circle(new Point(8,  - 2), 10,'#434f34')
		let eyeRightInner = new Circle(new Point(5,  -1), 4,'#5fe75f')
		eyeRight.shadow = {offsetX: 0, offsetY: 0, blur:7, color:"#79f506"}

		let eyeLeft= new Circle(new Point(-8,  - 2), 10,'#434f34')
		let eyeLeftInner = new Circle(new Point(-5,  -1), 4,'#5fe75f')
		eyeLeft.shadow = {offsetX: 0, offsetY: 0, blur:7, color:"#79f506"}

		eyeLeft.setParent(this.body)
		eyeRight.setParent(this.body)
		eyeLeftInner.setParent(this.body)
		eyeRightInner.setParent(this.body)
		this.body.setParent(this)

		this.shadow = {offsetX: 0, offsetY: 0, blur:10, color:"#0b112c"}
	}

	draw() {
		// not to draw, it's the root of enemy
	}
}