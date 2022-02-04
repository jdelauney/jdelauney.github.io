/**
 * Génère un nombre aléatoire dans l'intervalle défini par min et max inclus
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
export function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Version asynchrone du timeout
 * @param {Number} duration in ms
 * @return {Promise}
 */
export function wait(duration) {
	return new Promise(resolve => {
		window.setTimeout(resolve, duration)
	})
}

/**
 * Attend qu'un évènement dans le DOM soit levé
 * @param item HTMLElement element du dom
 * @param event String évènement sur l'item à surveiller
 * @return {Promise<unknown>}
 */
export function waitForDOMEvent(item, event) {
	return new Promise((resolve) => {
		const listener = () => {
			item.removeEventListener(event, listener);
			resolve();
		}
		item.addEventListener(event, listener);
	})
}

/**
 * Mélange aléatoirement un tableau
 * @param array
 */
export function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}