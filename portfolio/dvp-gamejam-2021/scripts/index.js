import BallIt from "./game/BallIt.js";

window.addEventListener("DOMContentLoaded", ()=>{
	const game = new BallIt("#gameScreen");
	game.start();
})