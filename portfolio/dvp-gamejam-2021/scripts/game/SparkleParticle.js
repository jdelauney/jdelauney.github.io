import AbstractGameObject from "../lib/core/GameObject.js";
//import Point from "../lib/maths/Point.js";
import MathUtils from "../lib/maths/MathUtils.js";

export default class BallParticle extends AbstractGameObject {
	constructor(position, size, acceleration, gravity, velocity, angle, maxAngle, color) {
		super()

		this.translation = position;

	}

	animate(deltaTime,currentTime, elapsedTime) {
		if (this.translation.x + this.size > this.engine.viewport.width || this.translation.x - this.size < 0) {
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
		this.context.beginPath()
		this.context.arc(0,0,this.size,0,MathUtils.PI2, false)
		//this.context.arc(0,0,this.size,0,this._PI2, false)
		this.context.fillStyle = this.color
		this.context.fill()
	}

}