import AbstractGameObject from "../lib/core/GameObject.js";

export default class Circle extends AbstractGameObject {
	constructor(position, radius, color) {
		super();
		this.translation = position
		this.size = radius
		this.width = this.size
		this.height = this.size
		this.color = color

		this.engine.cadencer.on("cadencerProgress", this.animate.bind(this))
	}

	animate(deltaTime,currentTime, elapsedTime) {
		if (this.name === "SUN") {
			this.rotation += 2.0
		}
		//this.matrix.translate(-this.position.x, -this.position.y).rotate(this.rotation).translate(this.position.x, this.position.y)
	}

	draw() {
		//this.updating()
		//console.log("CURRENT POSITION = ", this.position)
		this.context.beginPath()
		this.context.arc(0,0,this.size,0,this._PI2, false)
		this.context.fillStyle = this.color
		this.context.fill()
	}
}