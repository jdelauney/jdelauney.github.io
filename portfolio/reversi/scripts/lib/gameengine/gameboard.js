import CustomEventListener from "../core/customeventlistener.js";


export class Position {
	constructor(x = -1, y = -1) {
		this.x = x;
		this.y = y;
	}

	move(x, y) {
		this.x = x;
		this.y = y;
	}

	empty() {
		this.move(0,0);
	}

	pass() {
		this.move(-1, -1);
	}
}

export class Pawn {
	constructor(x, y, color) {
		this.position = new Position(x, y);
		this.color = color;
	}
}

export class CustomGameBoard extends CustomEventListener {
	constructor(width, height) {
		super();
		this.width = width;
		this.height = height;
		this.size = width * height;
		this.board = new Array(this.size);
		for (let i = 0; i < this.size; i++) {
			this.board[i] = null;
		}
	}

	isValidPosition(x, y) {
		return (((x >= 0) && (x < this.width)) && ((y >= 0) && (y < this.height)));
	}

	getCellIndex(x, y) {
		return (x + y * this.width);
	}

	getPawnAt(x,y) {
		if (this.isValidPosition(x, y)) {
			return this.board[x + y * this.width];
		}
		throw new Error('getPawnAt : Invalid position');
	}

	getPawn(position) {
		this.getPawnAt(position.x, position.y);
	}

	setPawnAt(x,y, pawn) {
		if (this.isValidPosition(x, y)) {
			pawn.position.move(x,y);
			this.board[x + y * this.width] = pawn;
		} else {
			throw new Error('setPawnAt : Invalid position');
		}
	}

	setPawn(pawn) {
		this.setPawnAt(pawn.position.x, pawn.position.y, pawn);
	}

	reset() {
		return new Promise((resolve, _reject) => {
			for (let i = 0; i < this.size; i++) {
				this.board[i] = null;
			}
			resolve();
		});

	}

	getPawnCountByColor(color) {
		return [...this.board].filter( item => ((item !== null) && (item.color === color ))).length;
		//[...this.board].reduce((acc, value) => ((value !== null) && (value.color === color)) ? acc + 1 : acc);
	}

	getEmptyCellCount() {
		return [...this.board].filter( item => (item === null )).length;
	}

	isEmptyCell(x, y) {
		return (this.board[x + y * this.width] === null);
	}

	clone() {
		const newBoard = new CustomGameBoard(this.width, this.height);
		newBoard.board = [...this.board]; //[...this.board].map((row) => row.slice(0)); ===> DeepCopy
		return newBoard;
	}
}

export class CustomPlayer {
	constructor(board, pawnColor, name) {
		this.board = board;
		this.pawnColor = pawnColor;
		this.type = 0;
		this.name = name;
	}

	getScore() {
		return this.board.getPawnCountByColor(this.pawnColor);
	}
}