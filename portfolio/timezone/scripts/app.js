import TimeZoneApplication from './timeZoneApplication.js';


/*=====[ MAIN APPLICATION ]==================================================================================*/

console.log("Welcome in World's O'Clock");

const timeZoneApp = new TimeZoneApplication();

	window.addEventListener("load", function() {
		timeZoneApp.runApplication("init");
	}, true);

/*===========================================================================================================*/

//setInterval(doOnClockTimer,1000);