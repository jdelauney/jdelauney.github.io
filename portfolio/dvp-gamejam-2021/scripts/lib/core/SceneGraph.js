import EventEmitter from "../utils/EventEmitter.js";

export default class SceneGraph extends EventEmitter {
	constructor() {
		super();
		this.children = []
		this.engine = window.gameengine
		//this.rendererContext = this.engine.renderer.context

	}

	addChild(child) {
		if( this.contains(child )) {
			this.removeChild(child);
		}
		this.children.push(child);
		child.parent = null
		return this
	}

	addChildAt(child, index) {
		const children = this.children;
		const tab1 = this.children.slice(0,index);
		const tab2 = this.children.slice(index);
		this.children = tab1.concat([child]).concat(tab2);

		child.parent = this;
	}

	getChildFromIndex(index) {
		return this.children[index]
	}

	getChildIndex(child) {
		return this.children.indexOf(child)
	}

	contains(child) {
		return child.parent === this && this.getChildIndex(child) > -1;
	}

	deleteChild(child) {
		let index = this.children.indexOf(child);
		if( index > -1 ) {
			this.children.splice(index,1);
		}
		child.parent = null;
	}

	deleteChildAt(index) {
		const child = this.children[index];
		if(child) {
			child.parent = null;
		}
		this.children.splice(index,1)
	}

	count() {
		return this.children.length
	}

	render() {
		//console.log('Render Scene')
		let max = this.children.length;
		for(let i = 0 ; i < max; i++ ) {
			this.children[i].render()
		}
	}
}