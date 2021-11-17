/**
 * Gestion d'un composant de type "tooltip", au clique sur mobile et au survol
 * avec placement et ajustement automatique et animations suivant les options passées en paramètre
 *
 * HTML :
 * <span class="tooltip tooltip__label" data-js-tooltip = '{ "position": "bottom", "screenPadding":24 }' aria-describedby="myTooltipContent" tabindex="0">
 *   my tooltip label
 *   <span id="myTooltipContent" class="tooltip__container" role="alertdialog" aria-hidden="true" aria-live="polite">
 *       this is my tooltip content
 *    </span>
 * </span>
 * @TODO : Améliorer ajustement gauche et droite
 *
 * @property {HTMLElement} element
 */
export class Tooltipsable {

	constructor(element) {
		this.element = element;
		this.container = this.element.querySelector('.tooltip__container');
		this.options = this.parseAttribute();
		this.hoverIt = false;
		this.onMouseEnter = this.onMouseEnterHandler.bind(this);
		this.onMouseLeave = this.onMouseLeaveHandler.bind(this);
		this.onTouchStart = this.onTouchStartHandler.bind(this);
		this.init();
	}

	/**
	 * Initialisation des options et des évènements du DOM
	 */
	init(){
		const info = this.findBestPosition();

		this.container.style.left = `${info.x}px`;
		this.container.style.top = `${info.y}px`;

		this.element.addEventListener('mouseenter', this.onMouseEnter);
		this.element.addEventListener('mouseleave', this.onMouseLeave);
		this.element.addEventListener("touchstart", this.onTouchStart);
	}

	/**
	 * Traite les options au format Json passées dans l'attribut de l'élément HTML
	 * @return {{showOnHover: boolean, hideOnClickOutside: boolean}|any}
	 */
	parseAttribute() {
		const defaultOptions = {
			position: 'top',
			//animation: "slide",
			delay:150,
			screenPadding: 12
		};

		if (this.element.dataset.jsTooltip.startsWith("{")) {
			return {
				...defaultOptions,
				...JSON.parse(this.element.dataset.jsTooltip),
			};
		}
		return {...defaultOptions};
	}

	findBestPosition() {

		let containerRect = this.container.getBoundingClientRect();
		const screenMaxWidth = (window.innerWidth - (this.options.screenPadding * 2) - 12);
		if (containerRect.width > screenMaxWidth) {
			this.container.style.maxWidth = `${screenMaxWidth}px`
		}

		containerRect = this.container.getBoundingClientRect();
		const tooltipRect = this.element.getBoundingClientRect();

		const pos = {x:0, y:0};

		let containerLeft;
		let containerRight;
		let containerTop;
		let containerBottom;

		switch (this.options.position) {
			case 'top':
				pos.y = -(containerRect.height + this.options.screenPadding);
				pos.x = ((tooltipRect.width * 0.5) - (containerRect.width * 0.5));
				containerLeft =  ((tooltipRect.x + tooltipRect.width * 0.5) - (containerRect.width * 0.5));
				containerTop =  (tooltipRect.y + tooltipRect.height) + pos.y;
				break;
			case 'bottom':
				pos.y = tooltipRect.height + this.options.screenPadding;
				pos.x = ((tooltipRect.width * 0.5) - (containerRect.width * 0.5));
				containerLeft =  ((tooltipRect.x + tooltipRect.width * 0.5) - (containerRect.width * 0.5));
				containerTop =  (tooltipRect.y + tooltipRect.height) + pos.y;
				break;
			case 'left':
				pos.x = -(containerRect.width + this.options.screenPadding);
				pos.y = (tooltipRect.height * 0.5) - (containerRect.height * 0.5);
				containerLeft =  tooltipRect.x  - (containerRect.width + this.options.screenPadding);
				containerTop =  tooltipRect.y - pos.y
				break;
			case 'right':
				pos.x = tooltipRect.width + this.options.screenPadding;
				pos.y = ((tooltipRect.height * 0.5) - (containerRect.height * 0.5));
				containerLeft =  tooltipRect.right + this.options.screenPadding;
				containerTop =  tooltipRect.y - pos.y
				break;
		}

		containerRight = containerLeft + containerRect.width;
		containerBottom = containerTop + containerRect.height;

		if (containerRight > (window.innerWidth - 12)) {
			const diff = containerRight - (window.innerWidth - 12);
			pos.x = pos.x - diff - this.options.screenPadding;
		}

		if (containerLeft < this.options.screenPadding ) {
			pos.x = -tooltipRect.x + this.options.screenPadding;
		}

		if (containerBottom > window.innerHeight) {
			pos.y = -(containerRect.height + this.options.screenPadding);
		}

		if (containerTop < this.options.screenPadding ) {
			pos.y = tooltipRect.height + this.options.screenPadding;
		}

		return pos;
	}

	/**
	 * Affiche la tooltip
	 */
	show() {
		const info = this.findBestPosition();

		this.container.style.left = `${info.x}px`;
		this.container.style.top = `${info.y}px`;

		if (this.options.delay > 0) {
			setTimeout(() => {
				this.container.classList.add('tooltip--open');
			},this.options.delay);
		} else {
			this.container.classList.add('tooltip--open');
		}

	}

	/**
	 * Cache la tootltip
	 */
	hide() {
		this.container.classList.remove('tooltip--open');
	}

	/**
	 * Ouvre ou cache la tooltip
	 */
	toogle() {
		if (this.container.classList.contains('tooltip--open')) {
			this.hide();
		} else {
			this.show();
		}
	}

	/**
	 * Gestion de l'évènement mouseleave
	 * @param event
	 */
	onMouseEnterHandler(event) {
		this.hoverIt = true;
		this.show();
	}

	/**
	 * Gestion de l'évènement mouseenter
	 * @param event
	 */
	onMouseLeaveHandler(event) {
		this.hoverIt = false;
		this.hide();
	}

	/**
	 * Gestion de l'évènement touchstart sur mobile
	 * @param event
	 */
	onTouchStartHandler(event) {
		this.toogle();
	}

	/**
	 * Attache une classe "Tooltipable" sur les éléments contenant l'attribut [data-js-tooltip]
	 * @returns {Tooltipsable[]}
	 */
	static bind() {
		return Array.from(document.querySelectorAll('[data-js-tooltip]')).map(
			(element) => {
				return new Tooltipsable(element);
			}
		);
	}
}