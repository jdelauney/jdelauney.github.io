import AbstractGameObject from "../lib/core/GameObject.js";
import MathUtils from "../lib/maths/MathUtils.js";

export default class Circle extends AbstractGameObject {
	constructor(position, radius, color) {
		super();
		this.translation = position
		this.size = radius
		this.width = this.size
		this.height = this.size
		this.color = color
	}


	draw() {
		this.context.beginPath()
		this.context.arc(0,0, this.size,0, MathUtils.PI2, false)
		this.context.fillStyle = this.color
		this.context.fill()
	}
}