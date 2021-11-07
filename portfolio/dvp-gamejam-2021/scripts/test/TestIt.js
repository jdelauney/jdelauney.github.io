import AbstractGameEngine from "../lib/core/GameEngine.js";
import DummyObject from "../lib/core/DummyObject.js";
import Point from "../lib/maths/Point.js";
import Circle from "../test/Circle.js";

export default class TestIt extends AbstractGameEngine {
	constructor(_canvas) {
		super(_canvas);
		this.displayGameMenu = true;
	}

	init() {

		//this.centerScreen = new Point(this.viewport.width / 2, this.viewport.height / 2)
		let sceneRoot = new DummyObject(new Point(0,0))
		let sunPos = new Point(this.viewport.width * 0.5, this.viewport.height * 0.5)
		console.log("POS ORIGIN = ", sunPos)
		let sunObject = new Circle(sunPos, 40, 'yellow')
		sunObject.rotation = 45
		sunObject.name = "SUN"
		let earthPos = new Point(180, 0)
		let earthObject = new Circle(earthPos, 30, 'blue')
		earthObject.name = "EARTH"
		let moonPos = new Point(80, 0)
		let moonObject= new Circle(moonPos, 20, 'silver')
		moonObject.name = "MOON"

		moonObject.setParent(earthObject)
		earthObject.setParent(sunObject)
		sunObject.setParent(sceneRoot)

		this.scene.addChild(sceneRoot)

		//console.log(this.scene.children)

		this.on('beforeRender', () =>{
			this.renderer.clear()
		})
	}


}