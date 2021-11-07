import AbstractParticleEngine from "../lib/core/ParticleEngine.js";
import Point from "../lib/maths/Point.js";
import BallParticle from "./BallParticle.js";

export default class BallParticleEngine extends AbstractParticleEngine {
	constructor(numberOfParticles) {
		super(numberOfParticles);

	}

	init() {
		console.log('Init Ball Particles Engine')
		const colours = [
			'rgba(177,166,234,0.8)',
			'rgba(100,119,227,0.7)',
			'rgba(120,143,229,0.8)',
			'rgba(49,73,218,0.6)'
		];
		for (let i=0; i< this.count; i++){
			let size = (Math.random() * 20) + 5;
			let x = (Math.random() * (( (this.engine.viewport.width - size * 2) - (size * 2)) + size * 2));
			let y = (Math.random() * (( (this.engine.viewport.height - size * 2) - (size * 2)) + size * 2));
			let position = new Point(x,y)
			let direction = new Point((Math.random() * 2) - 1, (Math.random() * 2) - 1)
			let speed = new Point((Math.random() * 3) - 1, (Math.random() * 3) - 1)
			let color = colours[Math.floor(Math.random() * colours.length)]

			this.particleArray.push(new BallParticle(position, direction, speed , size, color));
		}
	}
}