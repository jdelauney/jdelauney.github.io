import AbstractGameEngine from "../lib/core/GameEngine.js";
import BallParticleEngine from "./BallParticleEngine.js";
import DummyObject from "../lib/core/DummyObject.js";
import Point from "../lib/maths/Point.js";
import CheckPoint from "./CheckPoint.js";
import Circle from "./Circle.js";
import Player from "./Player.js";

export default class BallIt extends AbstractGameEngine {
	constructor(_canvas) {
		super(_canvas);
		this.displayGameMenu = true;

		this._PI2 = Math.PI * 2
	}

	init() {
		this.gameMenu = document.querySelector("#gameMenu")
		this.gameBackground = document.querySelector("#gameBackground")
		this.gameMenu.addEventListener("click", ()=> {
			this.displayGameMenu = false
			this.gameMenu.classList.add("gameMenu--hidden")
			this.canvas.classList.remove("filter-blur")
			this.gameBackground.classList.add("gameContainer__background--game")
			this.ballParticleEngine.visible = false

			this.startGame();
		})

		this.ballParticleEngine = new BallParticleEngine(300)
		this.scene.addChild(this.ballParticleEngine)

		//this.centerScreen = new Point(this.viewport.width / 2, this.viewport.height / 2)
		this.root = new DummyObject(new Point(0,0))
		this.root.visible = false;
		this.scene.addChild(this.root)
		this.checkPoints = []

		this.startPos = new Point(this.viewport.width * 0.5, this.viewport.height - 200)
		//this.startPos = new Point(0, 0)

		// for (let i = 0; i < 5; i++) {
			this.checkPoint = new CheckPoint(this.startPos, 0)
			//this.checkPoints.push(checkPoint)
		  let checkRoot  = new DummyObject(new Point(0,0))
		  checkRoot.addChild(this.checkPoint)
		  this.root.addChild(checkRoot)


      this.player = new Player(this.startPos)
			this.playerRoot  = new DummyObject(new Point(0,0))
		  this.playerRoot.name="PLAYERROOT"
		  this.playerRoot.addChild(this.player)
		  this.root.addChild(this.playerRoot)

		// }

		console.log(this.scene.children)

		this.on('updateFrame', this.onUpdateFrame.bind(this))

		this.on('beforeRender', () =>{
			this.renderer.clear()
		})
	}

	onUpdateFrame(deltaTime, currentTime, elapsedTime) {
		this.checkPoint.animate(deltaTime, currentTime, elapsedTime)
		let dt = currentTime;
		this.playerOffset = new Point( 7 * Math.sin(this._PI2 * dt * 0.288 + 25), 8 * Math.cos(this._PI2 * dt * .236 + 35))

		this.playerRoot.translation.x = this.playerOffset.x
		this.playerRoot.translation.y = this.playerOffset.y
		//this.player.animate(deltaTime, currentTime, elapsedTime)
	}

	startGame() {
		this.root.visible = true;
	}

}