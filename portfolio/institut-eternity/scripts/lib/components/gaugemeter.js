export class GaugeMeter {
	/**
	 *
	 * @param {HTMLElement} element
	 */
	constructor(element) {
		if (element instanceof HTMLElement) {
			this.element = element;
		}
		else {
			this.element = document.querySelector(element);
		}


		this.init();
	}

	init() {
		this.radius = this.element.dataset.jsGaugemeterRadius;
		this.minValue = this.element.dataset.jsGaugemeterMin;
		this.maxValue = this.element.dataset.jsGaugemeterMax;
		this.meter_needle = this.element.querySelector('.gauge-meter__needle');
		const svg = this.element.querySelector('svg');
		const circles = svg.querySelectorAll('.gauge-meter__circle');
		const total_circles = circles.length;
		for (let i = 0; i < total_circles; i++) {
			circles[i].setAttribute('r', this.radius);
		}
		this.meter_dimension = (this.radius * 2) + 100;
		this.element.style.width = this.meter_dimension + 'px';
		this.element.style.height = this.meter_dimension + 'px';

		this.cf = 2 * Math.PI * this.radius;
		this.semi_cf = this.cf / 2;
		const semi_cf_1by3 = this.semi_cf / 3;
		const semi_cf_2by3 = semi_cf_1by3 * 2;
		circles[0].setAttribute('stroke-dasharray', this.semi_cf + ',' + this.cf); // outline_curves
		circles[1].setAttribute('stroke-dasharray', this.semi_cf + ',' + this.cf); // low
		circles[2].setAttribute('stroke-dasharray', semi_cf_2by3 + ',' + this.cf); //avg
		circles[3].setAttribute('stroke-dasharray', semi_cf_1by3 + ',' + this.cf); //high
		circles[4].setAttribute('stroke-dasharray', this.semi_cf + ',' + this.cf); // mask
		circles[5].setAttribute('stroke-dasharray', 2 + ',' + (this.semi_cf - 2)); //outline_ends
		this.mask = circles[4]
	}

	setValue(value) {
		const percent = (value * 100) / (this.maxValue - this.minValue);
		const meter_value = this.semi_cf - ((percent * this.semi_cf) / 100);
		this.mask.setAttribute('stroke-dasharray', meter_value + ',' + this.cf);
		this.meter_needle.style.transform = 'rotate(' + (270 + ((percent * 180) / 100)) + 'deg)';
		// lbl.textContent = percent + '%';
	}

	/**
	 * Attache un "Gauge meter" sur les éléments contenant l'attribut [data-js-gaugemeter]
	 * @returns {collapse[]}
	 */
	static bind() {
		return Array.from(document.querySelectorAll("[data-js-gaugemeter]")).map(
			(element) => {
				return new GaugeMeter(element);
			}
		);
	}
}