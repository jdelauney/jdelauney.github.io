/**
 * Gestion d'un composant de type "dropdown", au clicque ou au survol suivant les options passées en paramètre
 *
 * @property {HTMLElement} element
 */
export class DropDown {

	/**
	 *
	 * @param {HTMLElement} element
	 */
	constructor(element) {
		this.element = element;
		this.options = this.parseAttribute();
		//	console.log('Options', this.options);
		this.target = this.element.querySelector('.dropdown__menu');

		this.onClick = this.onClick.bind(this);
		this.onClickOutside = this.onClickOutside.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);

		this.collapsed = true;
		this.initListener();
	}

	/**
	 * Traite les options au format Json passées dans l'attribut de l'élément HTML
	 * @return {{showOnHover: boolean, hideOnClickOutside: boolean}|any}
	 */
	parseAttribute() {
		const defaultOptions = {
			hideOnClickOutside: false,
			showOnHover: false
		};
		if (this.element.dataset.jsDropdown.startsWith("{")) {
			return {
				...defaultOptions,
				...JSON.parse(this.element.dataset.jsDropdown),
			};
		}
		return {...defaultOptions};
	}

	/**
	 * Initialisation des évènements du DOM
	 */
	initListener() {
		if (this.options.showOnHover) {
			this.element.addEventListener('mouseenter', this.onMouseEnter);
			this.element.addEventListener('mouseleave', this.onMouseLeave);
		} else if (this.options.hideOnClickOutside) {
			this.element.addEventListener('click', this.onClick);
			document.addEventListener('click', this.onClickOutside);
		} else {
			this.element.addEventListener('click', this.onClick);
		}
	}

	/**
	 * Affiche l'élément pointé par l'option "target"
	 */
	show() {
		this.target.classList.add('expanded');
		this.element.setAttribute('aria-expanded', "true");
		this.collapsed = false;
	}

	/**
	 * Cache l'élément pointé par l'option "target"
	 */
	hide() {
		this.target.classList.remove('expanded');
		this.element.setAttribute('aria-expanded', "false");
		this.collapsed = true;
	}

	/**
	 * Action déclencher par l'évènement mouseEnter
	 */
	onMouseEnter() {
		this.show();
	}

	/**
	 * Action déclencher par l'évènement mouseLeave
	 */
	onMouseLeave() {
		this.hide();
	}

	/**
	 * Action déclencher par l'évènement click du "bouton"
	 */
	onClick(event) {
		if (this.collapsed) {
			this.show();
			//event.stopPropagation();
		} else {
			this.hide();
		}
	}

	/**
	 * Action déclencher par l'évènement d'un click à l'extérieur de l'élément "Target"
	 */
	onClickOutside(event) {
		const isClickInside = this.element.contains(event.target);
		if (!isClickInside) {
			this.hide();
		}
		event.stopPropagation();
		//if (!this.collapsed) { this.hide(); }
	}

	/**
	 * Attache une classe "dropdown" sur les éléments contenant l'attribut [data-js-dropdown]
	 * @returns {dropdown[]}
	 */
	static bind() {
		return Array.from(document.querySelectorAll("[data-js-dropdown]")).map(
			(element) => {
				return new DropDown(element);
			}
		);
	}
}