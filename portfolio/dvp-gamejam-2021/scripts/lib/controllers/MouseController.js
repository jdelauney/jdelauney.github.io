import EventEmitter from "../utils/EventEmitter.js";
import Point from "../maths/Point.js";


export default class MouseController extends EventEmitter {
	constructor() {
		super();
		this.position = new Point()

	  window.addEventListener("mousemove", (event) => {
			this.position.x = event.x
		  this.position.y = event.y
		  this.trigger("mousemove", this.position)
	  })

		window.addEventListener("click", (event) => {
			switch (event.button) {
				case 1 :
					this.trigger("mouseClickLeft")
					break
				case 2 :
					this.trigger("mouseClickMiddle")
					break
				case 3 :
					this.trigger("mouseClickRight")
					break
			}
		})

		window.addEventListener('contextmenu', (event) => {
			event.preventDefault()
		})
	}
}