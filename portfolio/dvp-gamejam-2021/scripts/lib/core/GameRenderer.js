import EventEmitter from "../utils/EventEmitter.js";

export default class GameRenderer extends EventEmitter {
	constructor(_canvas) {
		super();
		this.engine = window.gameengine
		this.canvas = _canvas;
		this.context = this.canvas.getContext("2d");
	}

	resize() {
		this.canvas.width = this.engine.viewport.width
		this.canvas.height = this.engine.viewport.height
	}

	clear() {
		this.context.resetTransform()
		this.context.clearRect(0,0,this.canvas.width, this.canvas.height)
	}

  drawCircle(centerX, centerY, radius, fillColor, strokeColor, strokeWidth = 1) {
	  let circle = new Path2D();  // <<< Declaration
	  circle.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

	  this.context.fillStyle = fillColor;
	  this.context.fill(circle); //   <<< pass circle to context

	  this.context.lineWidth = strokeWidth;
	  this.context.strokeStyle = strokeColor;
	  this.context.stroke(circle);  // <<< pass circle here too
  }

	drawSquare(x,y, width, height, fillColor, strokeColor, strokeWidth = 1) {

	}

	drawSquareTo(x1,y1, x2, y2, fillColor, strokeColor, strokeWidth = 1) {

	}

	//drawTriangle
	//drawEllipse
	//drawPolygon
	//drawBezier
	//drawSpline
	//drawText

}