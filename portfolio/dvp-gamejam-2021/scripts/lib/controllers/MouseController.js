import EventEmitter from "../utils/EventEmitter.js";
import Point from "../maths/Point.js";


export default class MouseController extends EventEmitter {
	constructor() {
		super();
		this.enabled = false;
    const gameScreen = document.querySelector('#gameScreen')

		gameScreen.addEventListener("mousemove", (event) => {
			const info = {
				position: new Point(event.x,event.y),
				movement: new Point(event.movementX, event.movementY)
			}
		  this.trigger("mousemove", [info])
	  })

		gameScreen.addEventListener("click", (event) => {
			//console.log('Mouse Controller button clicked == ', event.button)
			if (this.enabled) {
				switch (event.button) {
					case 0 :
						this.trigger("mouseLeftClick")
						break
					case 1 :
						this.trigger("mouseMiddleClick")
						break
					case 2 :
						this.trigger("mouseRightClick")
						break
				}
			}
			event.preventDefault()
		})

		window.addEventListener('contextmenu', (event) => {
			event.preventDefault()
		})
	}
}