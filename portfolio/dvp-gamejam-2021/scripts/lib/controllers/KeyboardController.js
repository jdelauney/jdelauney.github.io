import EventEmitter from "../utils/EventEmitter.js";

export default class KeyboardController extends EventEmitter {
	constructor() {
		super();

		this.keysDown = [];

		this.VK_UP = 'ArrowUp'
		this.VK_DOWN = 'ArrowDown'
		this.VK_LEFT = 'ArrowLeft'
		this.VK_RIGHT = 'ArrowRight'
		this.VK_ENTER = 'Enter'
		this.VK_SPACE = 'Space'
		this.VK_SHIFTLEFT = 'ShiftLeft'
		this.VK_SHIFTRIGHT = 'ShiftRight'
		this.VK_CTRLLEFT = 'ControlLeft'
		this.VK_CTRLRIGHT = 'ControlRight'

		window.addEventListener("keydown", (event) => {
			//event.preventDefault()
			this.keysDown[event.code] = true
			this.trigger("keydown", this)
		})

		window.addEventListener("keyup", (event) => {
			//event.preventDefault()
			delete this.keysDown[event.code]
			this.trigger("keyup", this)
		})
	}
}