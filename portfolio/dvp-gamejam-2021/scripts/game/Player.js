import AbstractGameObject from "../lib/core/GameObject.js";
import Point from "../lib/maths/Point.js";
import Circle from "./Circle.js";
import MathUtils from "../lib/maths/MathUtils.js";

export default class Player extends AbstractGameObject {
	constructor(position) {
		super();
		this.translation = position
		this.currentPosition = position
		this.size = 20
		this.width = this.size
		this.height = this.size
		this.animationKind = "stand"
		this.nextCheckPoint = new Point(0,0)
		this.deltaSteps = 1;
		this.speed = 25
		this.DeltaPos = new Point(0,0)
		this.init()
	}

	init(){
		this.body = new Circle(new Point(0,0,), this.size,"#ec3a49")
		let eyeRight = new Circle(new Point(8,  - 2), 10,'black')
		let eyeRightInner = new Circle(new Point(5,  -1), 4,'white')
		eyeRight.shadow = {offsetX: 0, offsetY: 0, blur:7, color:"#00bbff"}

		let eyeLeft= new Circle(new Point(-8,  - 2), 10,'black')
		let eyeLeftInner = new Circle(new Point(-5,  -1), 4,'white')
		eyeLeft.shadow = {offsetX: 0, offsetY: 0, blur:8, color:"#00bbff"}

		eyeLeft.setParent(this.body)
		eyeRight.setParent(this.body)
		eyeLeftInner.setParent(this.body)
		eyeRightInner.setParent(this.body)
		this.body.setParent(this)

		this.shadow = {offsetX: 0, offsetY: 0, blur:20, color:"#ffffff"}
	}

	standAnimation(deltaTime,currentTime, elapsedTime) {
		this.playerOffset = new Point( 4 * Math.sin(MathUtils.PI2 * currentTime * 0.288 + 25), 4 * Math.cos(MathUtils.PI2 * currentTime * .236 + 35))

		//console.log(offsetRotation)
		this.body.translation.x = this.playerOffset.x
		this.body.translation.y = this.playerOffset.y
		this.body.rotation = 8 * Math.sin(MathUtils.PI2 * (currentTime - deltaTime) * 0.147 + 35)
	}

	// computeVelocityPoint(angle, distance) {
	// 	const x = Math.cos(angle * MathUtils.toRADIAN) * distance
	// 	const y = Math.sin(angle * MathUtils.toRADIAN) * distance
	// 	return new Point(x,y)
	// }
	//
	// computeTravelPoint(currentPosition, destinationPosition, distance) {
	// 	const angle = MathUtils.angleBetweenPoints(currentPosition.x, currentPosition.y, destinationPosition.x, destinationPosition.y)
	// 	const velocityPoint = this.computeVelocityPoint(angle, distance)
	// 	return new Point(currentPosition.x + velocityPoint.x, currentPosition.y + velocityPoint.y)
	// }

	computeTravelPoint(currentPosition, destinationPosition, steps) {
		const x = (destinationPosition.x - currentPosition.x) / steps
		const y = (destinationPosition.y - currentPosition.y) / steps
		return new Point(x,y)
	}
	gotoCheckpointAnimation(deltaTime,currentTime, elapsedTime) {
		if (this.deltaSteps > this.speed ) {
			this.animationKind = "stand"
			this.deltaTime = 0;
			this.currentPosition = this.translation
			return
		}
		this.translation.x += this.deltaPos.x
		this.translation.y += this.deltaPos.y
		//console.log("TRANSLATE TO === ", this.translation)
		this.deltaSteps++
	}

	animate(deltaTime,currentTime, elapsedTime) {
		if (this.animationKind === "stand") {
			this.standAnimation(deltaTime,currentTime, elapsedTime)
		}
		else if (this.animationKind === "gotoNext") {
			this.gotoCheckpointAnimation(deltaTime,currentTime, elapsedTime)
		}
	}

	gotoNextPoint(nextPoint) {
		this.nextCheckPoint = nextPoint
		this.currentPosition = this.translation
		this.animationKind = "gotoNext"
		this.deltaPos = this.computeTravelPoint(this.currentPosition, this.nextCheckPoint, this.speed )
		this.deltaSteps = 1
	}

	draw() {
		// Draw nothing here, it's the root
	}
}