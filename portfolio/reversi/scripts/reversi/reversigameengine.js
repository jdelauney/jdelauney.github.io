import CustomEventListener from "../lib/core/customeventlistener.js";
import { Position, Pawn, CustomGameBoard, CustomPlayer } from '../lib/gameengine/gameboard.js';
import { ReversiAIEngine, ReversiEngineAI_Factory } from '../reversi/reversiai.js'
import { wait } from "../lib/core/utils.js";


export const PlayerType = {
	HUMAN : 0,
	COMPUTER: 1
}

export const PawnColor = {
	BLACK : 0,
	WHITE : 1
}

class HumanPlayer extends CustomPlayer {
	constructor(board, pawnColor, name) {
		super(board, pawnColor, name);
		this.type = PlayerType.HUMAN;
	}
}

class ComputerPlayer extends CustomPlayer {
	constructor(board, pawnColor, name, engineAIAdapter = ReversiAIEngine.MINMAX_ALPHABETA) {
		super(board, pawnColor, name);
		this.type = PlayerType.COMPUTER;
		this.engineAI = ReversiEngineAI_Factory.factory(this.board, engineAIAdapter);
	}
}

class ReversiBoard extends CustomGameBoard {
	constructor() {
		super(8,8);
	}

	clone() {
		const newBoard = new ReversiBoard();
		// Clone le tableau mais garde les références des objets
		//newBoard.board = [...this.board];

		// Solution deepCopy (on fait une copie de l'objet):
		newBoard.board = this.board.map(object => ({...object}));
		return newBoard;
	}

	isValidMove(playerColor, x, y) {
		if ((!this.isValidPosition(x, y)) || (!this.isEmptyCell(x, y))) {
			return false;
		}

		const opponentPlayerColor = (playerColor === PawnColor.WHITE) ? PawnColor.BLACK : PawnColor.WHITE;

		for (let i = -1; (i < 2); i++ ) {
			for (let j = -1; (j < 2); j++) {

				if ((j === 0) && (i === 0)) {
					continue;
				}

				const vx = (x + i);
				const vy = (y + j);

				// On explore seulement si c'est la couleur de l'opposant
				if (this.isValidPosition(vx, vy)) {
					const pawn = this.getPawnAt(vx, vy);
					if (pawn !== null) {
						if (pawn.color !== opponentPlayerColor) {
							continue;
						}
					}
				}

				for (let k = 1; (k < this.size); k++) {
					const nx = x + k * i;
					const ny = y + k * j;
					if (this.isValidPosition(nx, ny)) {
						const cellPawn = this.getPawnAt(nx, ny);
						if (cellPawn === null) {
							break;
						}
						if (cellPawn.color === playerColor) {
							return true;
						}
						else if ( cellPawn.color === opponentPlayerColor) {
							continue;
						}
					}
				}
			}
		}
		return false;
	}

	getValidMoves(playerColor) {
		const moves = [];
		for (let i = 0; (i < this.width); i++ ) {
			for (let j = 0; (j < this.height); j++ ) {
				if (this.isValidMove(playerColor, i, j)) {
					const newPos = new Position(i, j);
					moves.push(newPos);
				}
			}
		}
		return moves;
	}

	hasValidMoves(playerColor) {
		const moves = this.getValidMoves(playerColor);
		return (moves.length > 0);
	}

	makeMove(playerColor, x, y, triggerEvents = true) {
		const isValid = this.isValidMove(playerColor, x, y)

		if (!isValid)  {
			return
		}

		let flipperPawns = 1;
		const newPawn = new Pawn(x, y, playerColor)
		this.setPawn(newPawn);
		if (triggerEvents) {
			this.trigger("onPutPawn", newPawn);
		}

		const opponentPlayerColor = (playerColor === PawnColor.WHITE) ? PawnColor.BLACK : PawnColor.WHITE;
		return new Promise((resolve, _reject) => {
			for (let i = -1; (i < 2); i++) {
				for (let j = -1; (j < 2); j++) {
					if ((j === 0) && (i === 0)) {
						continue;
					}
					// On explore seulement si c'est la couleur de l'opposant
					const vx = (x + i);
					const vy = (y + j);
					if (this.isValidPosition(vx, vy)) {
						const pawn = this.getPawnAt(vx, vy);
						if (pawn !== null) {
							if (pawn.color !== opponentPlayerColor) {
								continue;
							}
						}
					}

					let valid = false;
					for (let k = 1; (k < this.size); k++) {
						const nx = x + k * i;
						const ny = y + k * j;
						if (this.isValidPosition(nx, ny)) {
							const cellPawn = this.getPawnAt(nx, ny);
							if (cellPawn === null) {
								break;
							}
							if (cellPawn.color === opponentPlayerColor) {
								continue;
							} else if (cellPawn.color === playerColor) {
								valid = true;
								break;
							}
						}
					}

					if (valid) {
						for (let k = 1; (k < this.size); k++) {
							const nx = x + k * i;
							const ny = y + k * j;
							if (this.isValidPosition(nx, ny)) {
								const cellPawn = this.getPawnAt(nx, ny);
								if (cellPawn.color === opponentPlayerColor) {
									cellPawn.color = playerColor;
									if (triggerEvents) {
										this.trigger("onFlipPawn", cellPawn);
									}
								} else if (cellPawn.color === playerColor) {
									valid = true;
									flipperPawns += (k - 1);
									break;
								}
							}
						}
					}
				}
			}
			resolve();
		});
	}

	hasAvailableMoves() {
		return ((this.getEmptyCellCount() !== 0) && ((this.hasValidMoves(PawnColor.BLACK)) || (this.hasValidMoves(PawnColor.WHITE))));
	}

	isGameOver(triggerEvent = true) {
		let winner = null;
		if (!this.hasAvailableMoves()) {
			const blackCount = this.getPawnCountByColor(PawnColor.BLACK);
			const whiteCount  = this.getPawnCountByColor(PawnColor.WHITE)
			if ( blackCount !== whiteCount ) {
				winner =  ( blackCount > whiteCount ) ? PawnColor.BLACK : PawnColor.WHITE;
			}
			if (triggerEvent) {
				this.trigger("onGameOver", winner);
			}
			return true;
		}
		return false;
	}
}

export class ReversiGameEngine extends CustomEventListener{
	constructor() {
		super();
		this.board = new ReversiBoard();
		this.players =  new Array(2);

		this.board.addEventListener("onPutPawn", this.triggerOnPutPawnHandler.bind(this));
		this.board.addEventListener("onFlipPawn", this.triggerOnFlipPawnHandler.bind(this));
		this.board.addEventListener("onGameOver", this.triggerOnGameOverHandler.bind(this));

		this.initBoard();
	}

	triggerOnPutPawnHandler(pawn) {
			this.trigger("onPutPawn", pawn);
	}

	triggerOnFlipPawnHandler(pawn) {
			this.trigger("onFlipPawn", pawn);
	}

	triggerOnGameOverHandler(winner) {
			this.trigger("onGameOver", winner);
	}

	initBoard() {
		let mid = (this.board.width / 2) - 1;
		this.board.setPawn(new Pawn(mid, mid, PawnColor.WHITE));
		this.board.setPawn(new Pawn(mid + 1, mid + 1, PawnColor.WHITE));
		this.board.setPawn(new Pawn(mid + 1, mid, PawnColor.BLACK));
		this.board.setPawn(new Pawn(mid, mid + 1, PawnColor.BLACK));
	}

	setPlayer(playerNum, playerType, pawnColor, name, engineAIAdapter  = ReversiAIEngine.MINMAX_ALPHABETA) {
		if (playerType === PlayerType.HUMAN) {
			this.players[playerNum] = new HumanPlayer(this.board, pawnColor, name)
		}
		else {
			this.players[playerNum] = new ComputerPlayer(this.board, pawnColor, name, engineAIAdapter)
		}
	}

	getOpponentPlayer() {
		return (this.currentPlayer.pawnColor === this.players[0].pawnColor) ? this.players[1] : this.players[0];
	}

	async nextTurn() {
		if (!this.board.isGameOver()) {
			this.currentPlayer = this.getOpponentPlayer();

			if (!this.board.hasValidMoves(this.currentPlayer.pawnColor)) {
				this.trigger('onNotAvailableMoves', this.currentPlayer);
				this.currentPlayer = this.getOpponentPlayer();
				//this.nextTurn();
			}

			this.trigger('onNextTurn');

			if (this.currentPlayer.type === PlayerType.COMPUTER) {
				await wait(500);
				const bestMove = await this.currentPlayer.engineAI.getBestMove(this.currentPlayer.pawnColor);
				this.makeMove(bestMove.x, bestMove.y);
			}
		}
	}

	async makeMove(x, y) {
		if (this.board.isValidMove(this.currentPlayer.pawnColor, x, y)) {
			await this.board.makeMove(this.currentPlayer.pawnColor, x, y, true);
			this.trigger("onUpdateBoard", this.board);
			this.nextTurn();
		}
		else {
			this.trigger("onInvalidMove");
		}
	}

	async startGame() {
		await this.board.reset();
		this.initBoard();
		this.currentPlayer = (this.players[0].pawnColor === PawnColor.BLACK) ? this.players[0] : this.players[1];
		this.trigger("onStartGame");
	}
}