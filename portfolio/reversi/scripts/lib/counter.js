export class Counter {
	constructor(Selector, Start = 0, End = 100, Duration = 500){
		this.element = document.querySelector(Selector);
    this.setCounter(Start, End, Duration);
	}

	setCounter(Start, End, Duration) {
		this.Start = Start;
		this.End = End;
		this.Duration = Duration;
		this.Counter = this.Start;
		this.Steps = Math.abs(this.End - this.Start);
		this.StepDuration = this.Duration / this.Steps;
	}

	timerCallback() {
		if ( (this.Counter > this.End && this.Start < this.End) || (this.Counter < this.End && this.Start > this.End) ) {
			clearInterval(this.timer);
		}
		else if( this.Counter < this.End && this.Start < this.End )
		{
			this.Counter++;
			this.element.innerText = Math.round(this.Counter);
		}
		else if (this.Counter > this.End && this.Start > this.End){
			this.Counter--;
			this.element.innerText = Math.round(this.Counter);
		};
	}

	start(Start, End, Duration = 500) {
		this.setCounter(Start, End, Duration);
		this.timer = setInterval(this.timerCallback.bind(this),  Math.round(this.StepDuration));
	}
}