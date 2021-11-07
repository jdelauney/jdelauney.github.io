import EventEmitter from "../utils/EventEmitter.js";
import MouseController from "../controllers/MouseController.js";
import KeyboardController from "../controllers/KeyboardController.js";


export default class GameController extends EventEmitter {
	constructor() {
		super();
		this.mouse = new MouseController()
		this.keyboard = new KeyboardController()
	}
}