import EventEmitter from './EventEmitter.js'

export default class Cadencer extends EventEmitter
{
	constructor()
	{
		super()

		// Setup
		this.startTime = Date.now()
		this.currentTime = this.startTime * 0.001
		this.elapsedTime = 0
		this.deltaTime = 0
		this.enabled = false
		this.cadencerProgress = this._cadencerProgress.bind(this);
	}

	_cadencerProgress() {
		this.ticker = window.requestAnimationFrame(this.cadencerProgress)
		let currentTime = Date.now()
		currentTime *= 0.001
		this.deltaTime = Math.min(currentTime - this.currentTime, 0.1)
		this.elapsedTime += this.enabled ? this.deltaTime : 0
		this.currentTime = currentTime
		this.trigger('cadencerProgress') //,this.deltaTime,this.currentTime, this.elapsedTime)
	}

	start() {
		this.enabled = true
		this.cadencerProgress();
	}

	pause() {
		this.enabled = false
	}

	stop()
	{
		window.cancelAnimationFrame(this.ticker)
		this.enabled = false
	}

}