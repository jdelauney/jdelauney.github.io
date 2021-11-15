/**
 * Gestion pour cacher/montrer un élément au clique d'un autre élément
 *
 * @todo Ajouter options pour definir les chevrons close/open
 *
 * @property {HTMLElement} element
 */
export class Collapsable {

	/**
	 *
	 * @param {HTMLElement} element
	 */
	constructor(element) {
		this.element = element;
		this.chevron = this.element.querySelector('.chevron');
		//	console.log(this.chevron);
		this.onClick = this.onClick.bind(this);
		this.collapsed = true;
		this.initListener();
	}

	/**
	 * Initialisation des évènements du DOM
	 */
	initListener() {
		this.element.addEventListener('click', this.onClick);
	}

	onClick() {
		/**
		 * Action de l'évènement click
		 * @todo passer le data-js-target dans des options à passer dans le data-js-collapse sous forme de json
		 */
		const target = document.getElementById(this.element.dataset.jsCollapsableTarget);
		//console.log('Target == ', target)

		if (this.collapsed) {
			target.classList.add('expanded');
			this.element.classList.add('open');
			this.element.setAttribute('aria-expanded', "true");
			if (this.chevron !== null) {
				this.chevron.className='chevron fas fa-angle-down fa-fix';
			}
		} else {
			target.classList.remove('expanded');
			this.element.classList.remove('open');
			this.element.setAttribute('aria-expanded', "false");
			if (this.chevron !== null) {
				this.chevron.className='chevron fas fa-angle-right fa-fix';
			}
		}
		this.collapsed = !this.collapsed;
	}

	/**
	 * Attache un "collapse" sur les éléments contenant l'attribut [data-js-collapse]
	 * @returns {collapse[]}
	 */
	static bind() {
		return Array.from(document.querySelectorAll("[data-js-collapsable]")).map(
			(element) => {
				return new Collapsable(element);
			}
		);
	}
}