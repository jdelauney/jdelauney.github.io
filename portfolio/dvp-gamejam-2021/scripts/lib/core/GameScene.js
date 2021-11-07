import EventEmitter from "../utils/EventEmitter.js";
import SceneGraph from "./SceneGraph.js";

export default class AbstractGameScene extends EventEmitter{
	constructor() {
		super()

		if (this.constructor === AbstractGameScene) {
			throw new TypeError("The abstract class 'AbstractGameScene' cannot be instantiated directly");
		}

		this.engine = window.gameengine;
		this.sceneGraph = new SceneGraph();


	}

	init() {

	}

	updateFrame(deltaTime, currentTime, elapsedTime) {

	}
}