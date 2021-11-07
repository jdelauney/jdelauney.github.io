import AbstractGameObject from "./GameObject.js";

export default class DummyObject extends AbstractGameObject {
	constructor(position) {
		super()
		this.translation = position
		//this.worldMatrix.translate(this.engine.viewport.width * 0.5,this.engine.viewport.height * 0.5,)
	}

	draw(){
		//console.log('Draw Dummy')
	  // if (this.name === "PLAYERROOT") {
		//   console.log('Draw Player Root')
		//   console.log('Translation = ', this.translation)
	  // }

	}
}