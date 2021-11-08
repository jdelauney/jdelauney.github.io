import AbstractGameObject from "./GameObject.js";

export default class AbstractParticleEngine extends AbstractGameObject{
	constructor(numberOfParticles) {
		super()
		console.log('Init Particle Engine = ', numberOfParticles)
		//this.particleArray = []
		this.count = numberOfParticles
		this.engine = window.gameengine
		this.renderer =this.engine.renderer
		this.visible = true;
    this.init()
	}

	init() {
		throw new Error("You need to implement this method in children");
	}

	// render() {
	// 	if (this.visible) {
	// 		for (let i = 0; i < this.count; i++){
	// 			this.particleArray[i].render();
	// 		}
	// 	}
	// }
}