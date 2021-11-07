import AbstractGameObject from "../lib/core/GameObject.js";

export default class BallParticle extends AbstractGameObject {
	constructor(position, direction, speed, size, color) {
		super()

    this.translation = position;
		this.direction = direction
		this.speed = speed
		this.size = size
		this.color = color


		console.log('Create Ball Particle')
		this.width = size
		this.height = size
	}

	updating() {
		if (this.translation.x > this.engine.viewport.width || this.translation.x < 0) {
			this.direction.x = -this.direction.x
		}
		if (this.translation.y + this.size > this.engine.viewport.height || this.translation.y - this.size < 0) {
			this.direction.y = -this.direction.y
		}

		this.translation.x += this.direction.x * this.speed.x;
		this.translation.y += this.direction.y * this.speed.y;
	}

	draw() {
		//console.log('Draw Ball Particle Object')
		this.updating()

		this.context.beginPath()
		this.context.arc(0,0,this.size,0,this._PI2, false)
		//this.context.arc(0,0,this.size,0,this._PI2, false)
		this.context.fillStyle = this.color
		this.context.fill()
	}

}