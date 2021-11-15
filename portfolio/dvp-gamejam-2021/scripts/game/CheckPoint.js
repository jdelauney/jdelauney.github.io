import AbstractGameObject from "../lib/core/GameObject.js";
import Circle from "./Circle.js";
import Point from "../lib/maths/Point.js";
import MathUtils from "../lib/maths/MathUtils.js";
import DummyObject from "../lib/core/DummyObject.js";
import Enemy from "./Enemy.js";

export default class CheckPoint extends AbstractGameObject {
	constructor(position, radius = 0, numberOfEnemy = 0, rotationSpeed = 1.0, rotationDir = 1) {
		super('CHECKPOINT', position);
		this.size = 40 + radius
		this.width = this.size
		this.height = this.size
		this.rotationSpeed = rotationSpeed
		this.rotationDir = rotationDir
    this.numberOfEnemy = numberOfEnemy
		this.init()
	}

	init(){

		const circlePos1 = new Point(0,  - this.size)
		let circle1 = new Circle(circlePos1, 5,'white')
		const circlePos2 = new Point(0,  + this.size)
		let circle2 = new Circle(circlePos2, 5,'white')
		circle1.setParent(this)
		circle2.setParent(this)
		const pivot = new Circle(new Point(0,0), 5, "#6660ec")
    pivot.shadow = {offsetX: 0, offsetY: 0, blur:10, color:"#10bee5"}
		pivot.setParent(this)

		if (this.numberOfEnemy > 0) {
			this.layerEnemy = new DummyObject(new Point(0,0))
			this.enemyRotationDir = Math.random() < 0.5 ? -1 : 1
			this.enemyRotationSpeed = MathUtils.randomRange(0.2, 1.0) + 0.1
			let angleStep = 0;

			for (let i = 0; i < this.numberOfEnemy; i++) {
				let c = Math.cos(angleStep);
				let s = Math.sin(angleStep);
				const size = MathUtils.clampMin(Math.random(), 0.5) //MathUtils.randomRange(0.5, 1.0)
				const distance = this.size + size + 30 //+ MathUtils.randomRange(0, 10)
				const pos = new Point((c * distance),(s * distance))
				const enemy = new Enemy(pos, size)
				enemy.explodeDest = new Point( new Point((c * 250),(s * 250)))
				enemy.setParent(this.layerEnemy)
				let angleBetween = MathUtils.randomRange(10, 25)
				angleStep += angleBetween;

			}
			this.layerEnemy.setParent(this)
		}

		this.shadow = {offsetX: 0, offsetY: 0, blur:3, color:"#09122d"}


	}

	animate(deltaTime,currentTime, elapsedTime) {
		 this.rotation += this.rotationSpeed * this.rotationDir
		 if (this.numberOfEnemy > 0) {
			//this.layerEnemy.rotation += MathUtils.clampMin(Math.min(this.enemyRotationSpeed, this.rotationSpeed + 0.5), 1.0) * this.enemyRotationDir
			this.layerEnemy.rotation += this.enemyRotationSpeed * this.enemyRotationDir
			this.layerEnemy.child.children.forEach((child) => {
				child.rotation = -(this.rotation + this.layerEnemy.rotation)
				child.explodeDest.rotate(this.layerEnemy.rotation)
			})
		}
			//this.matrix.translate(-this.position.x, -this.position.y).rotate(this.rotation).translate(this.position.x, this.position.y)
	}

	draw() {
		//this.updating()

		//this.matrix.translate(this.engine.viewport.width * 0.5,this.engine.viewport.height * 0.5)
			//.rotate(this.rotation).translate(-this.position.x, -this.position.y)
		//this.matrix.translate(this.engine.viewport.width * 0.5,this.engine.viewport.height * 0.5).rotate(this.rotation).translate(-this.engine.viewport.width * 0.5,-this.engine.viewport.height * 0.5)
		//this.context.translate(this.engine.viewport.width * 0.5,this.engine.viewport.height * 0.5)
		 //this.context.translate(this.position.x,this.position.y)
		 // this.context.rotate(this.rotation)
		 // this.context.translate(-this.position.x,-this.position.y)

		this.context.beginPath()
		this.context.arc(0,0,this.size,0,MathUtils.PI2, false)
		this.context.strokeWidth = 50
		this.context.strokeStyle = "white"
		this.context.stroke()
	}
}