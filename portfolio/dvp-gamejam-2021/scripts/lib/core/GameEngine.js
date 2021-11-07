import Cadencer from '../utils/Cadencer.js'
import Viewport from "../utils/Viewport.js";
import EventEmitter from "../utils/EventEmitter.js";
import GameRenderer from "./GameRenderer.js";
import GameController from "./GameController.js";
import SceneGraph from "./SceneGraph.js";

let gameEngineInstance = null

export default class AbstractGameEngine extends EventEmitter
{
	constructor(_canvas) {
		super()

		if (this.constructor === AbstractGameEngine) {
			throw new TypeError("The abstract class 'AbstractGameEngine' cannot be instantiated directly");
		}

		// Singleton
		if(gameEngineInstance)
		{
			return gameEngineInstance
		}
		gameEngineInstance = this

		// Global access
		window.gameengine = this

		// Options
		if (!(_canvas instanceof HTMLCanvasElement)) {
			if (_canvas instanceof HTMLElement) {
				this.canvas = _canvas
			} else {
				console.log('Set canvas from QuerySelector : ', _canvas)

				this.canvas = document.querySelector(_canvas)
			}
		}

		console.log(this.canvas)

		// Setup
		this.viewport = new Viewport()
		this.cadencer = new Cadencer()
		this.renderer = new GameRenderer(this.canvas)
		this.controller = new GameController()
		this.scene = new SceneGraph()

		this.viewport.on('resize', () =>
		{
			this.resize()
		})

		this.resize();
		this.init();

		this.cadencer.on('cadencerProgress', this.onCadencerProgress.bind(this))

	}

	init() {
		throw new Error("You need to implement this method in children");
	}

	resize() {
		this.renderer.resize()
	}

	onCadencerProgress() {
		 const deltaTime = this.cadencer.deltaTime
		 const currentTime = this.cadencer.currentTime
		 const elapsedTime = this.cadencer.elapsedTime
		//console.log(deltaTime)
		this.trigger('updateFrame',[deltaTime,currentTime, elapsedTime])
		this.trigger('beforeRender')
		this.scene.render()
		this.trigger('afterRender')
	}

	start() {
		this.cadencer.start();
	}

	stop() {
		this.cadencer.stop();
	}
}