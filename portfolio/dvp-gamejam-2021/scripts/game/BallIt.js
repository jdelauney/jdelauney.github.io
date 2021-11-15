import AbstractGameEngine from "../lib/core/GameEngine.js";
import BallParticleEngine from "./BallParticleEngine.js";
import DummyObject from "../lib/core/DummyObject.js";
import Point from "../lib/maths/Point.js";
import CheckPoint from "./CheckPoint.js";
import Player from "./Player.js";
import MathUtils from "../lib/maths/MathUtils.js";

export default class BallIt extends AbstractGameEngine {
	constructor(_canvas) {
		super(_canvas);
		this.displayGameMenu = true;
	}

	createNewCheckpoint(dir) {
		const size = MathUtils.randomRange(0, 25)
		const distanceHorizontal = MathUtils.randomRange(60, 250)
		const distanceVertical = MathUtils.randomRange(45, 80)  + (this.checkpointlastSize + 80) + size
		this.checkpointLastPos.x += dir * distanceHorizontal
		this.checkpointLastPos.x = MathUtils.clamp(this.checkpointLastPos.x, (60 + size), (this.viewport.width - (size + 60)))
		this.checkpointLastPos.y -= distanceVertical
		const newPos = new Point(this.checkpointLastPos.x, this.checkpointLastPos.y)
		this.checkpointCoords.push(newPos)
		let rotDir = Math.random() < 0.5 ? -1 : 1
		const checkPoint = new CheckPoint(newPos, size , MathUtils.randomRange(0, 7), MathUtils.clamp(MathUtils.randomRange(1, 3 - 0.5), 0.5, 2.0), rotDir)
		this.checkpointlastSize = checkPoint.size
		checkPoint.setParent(this.checkRoot)
	}

  init() {
		//const startgame = async () => { await this.startGame() }

		this.gameMenu = document.querySelector("#gameMenu")
		this.playBtn = document.querySelector("#playBtn")
		this.gameBackground = document.querySelector("#gameBackground")
		this.playBtn.addEventListener("click", ()=> {
			this.displayGameMenu = false
			this.gameMenu.classList.add("gameMenu--hidden")
			this.canvas.classList.remove("filter-blur")
			this.gameBackground.classList.add("gameContainer__background--game")
			this.ballParticleEngine.visible = false
		  this.startGame()
		})

		this.checkpointCoords = []
		this.nextCheckpointIndex = 1

		this.root = new DummyObject(new Point(0,0))
		this.root.visible = false;
		this.scene.addChild(this.root)

		this.ballParticleEngine = new BallParticleEngine(300)
		this.scene.addChild(this.ballParticleEngine)

		// Start check point
		this.startPos = new Point(this.viewport.width * 0.5, this.viewport.height - 200)
		this.checkRoot  = new DummyObject(new Point(0,0))

		this.checkpointCoords.push(this.startPos)

		this.checkpointLastPos = new Point(this.startPos.x, this.startPos.y)
		this.checkpointlastSize = 0//checkPoint.size
	  let dir = Math.random() < 0.5 ? -1 : 1
		for (let i = 0; i < 3; i++) {
			this.createNewCheckpoint(dir)
			dir = -dir
		}
		this.startCheckPoint = new CheckPoint(this.startPos,0)
		this.startCheckPoint.setParent(this.checkRoot)
		this.checkRoot.setParent(this.root)

		this.player = new Player(this.startPos)
		this.player.setParent(this.root)


		console.log(this.root.child.children)

		this.on('updateFrame', this.onUpdateFrame.bind(this))

		this.on('beforeRender', () =>{
			this.renderer.clear()
		})
	}
  onMouseLeftClick() {
	  //console.log("Mouse left click")
	  if (this.root.visible) {
		  const nextPoint = this.checkpointCoords[this.nextCheckpointIndex]
		  this.player.gotoNextPoint(nextPoint)
		  this.nextCheckpointIndex++
	  }
  }

	onMouseMove(info) {
		if (this.root.visible) {
			this.checkRoot.translation.x += info.movement.x
			this.checkRoot.translation.y += info.movement.y
		}
	}

	onUpdateFrame(deltaTime, currentTime, elapsedTime) {
		if (this.ballParticleEngine.visible) {
			this.ballParticleEngine.animate(deltaTime, currentTime, elapsedTime)
		}
		else {
			this.checkRoot.child.children.forEach((child) => {
				child.animate(deltaTime, currentTime, elapsedTime)
			})
			this.player.animate(deltaTime, currentTime, elapsedTime)
		}
	}

	startGame() {
		this.root.visible = true;
		this.controller.mouse.on('mouseLeftClick', this.onMouseLeftClick.bind(this) )
		//this.controller.mouse.on('mousemove', this.onMouseMove.bind(this) )
		this.controller.mouse.enabled = true
	}

}