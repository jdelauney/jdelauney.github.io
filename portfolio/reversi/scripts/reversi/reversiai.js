import CustomEngineAI_adapter from '../lib/gameengine/engineai.js';
import {PawnColor} from "./reversigameengine.js";
import {removeDuplicateObjectFromArray, shuffleArray} from "../lib/core/utils.js";
import {Position} from "../lib/gameengine/gameboard.js";

export const ReversiAIEngine = {
	MINMAX : 0,
	MINMAX_ALPHABETA : 1
}

class Reversi_Minmax_AI_adapter extends CustomEngineAI_adapter  {
	constructor(board) {
		super(board);
	}

	getBestMove() {

	}
}

class Reversi_MinmaxAlphaBetaPrunning_AI_adapter extends CustomEngineAI_adapter {
	constructor(board) {
		super(board);
	}
	// compute scores : cf https://paperzz.com/doc/7043006/evaluation-function-to-predict-move-in-othello

	computeParityScore(board, playerColor, opponentColor) {
		const playerCount =  board.getPawnCountByColor(playerColor);
		const opponentCount = board.getPawnCountByColor(opponentColor);

		const diff = 64 - (playerCount + opponentCount);
		const globalParity = ((diff % 2) === 0) ? -10 : 10;
		//return playerCount - opponentCount;
		return (Math.ceil(100 * ((playerCount - opponentCount) / (playerCount + opponentCount)))) + globalParity;
	}

	computeMobilityScore(board, playerColor, opponentColor) {
		const playerMoves = board.getValidMoves(playerColor).length;
		const opponentMoves = board.getValidMoves(opponentColor).length;
		//return 100 * (playerMoves   - opponentMoves);
		return  (playerMoves + opponentMoves) === 0 ? 0 : Math.ceil(100 * ((playerMoves - opponentMoves) / (playerMoves + opponentMoves)));
	}

/*	computeCornerParityScore(board, playerColor) {
		let playerCorners = 0;
		let opponentCorners = 0;

		if (!board.isEmptyCell(0, 0)) {
			const pawn = board.getPawnAt(0,0);
			if (pawn.color === playerColor) {
				playerCorners++;
			}
			else  {
				opponentCorners++;
			}
		}

		if (!board.isEmptyCell(7, 0)) {
			const pawn = board.getPawnAt(7,0);
			if (pawn.color === playerColor) {
				playerCorners++;
			}
			else  {
				opponentCorners++;
			}
		}

		if (!board.isEmptyCell(0, 7)) {
			const pawn = board.getPawnAt(0,7);
			if (pawn.color === playerColor) {
				playerCorners++;
			}
			else  {
				opponentCorners++;
			}
		}

		if (!board.isEmptyCell(7, 7)) {
			const pawn = board.getPawnAt(7,7);
			if (pawn.color === playerColor) {
				playerCorners++;
			}
			else  {
				opponentCorners++;
			}
		}

		return  (playerCorners + opponentCorners) === 0 ? 0 : Math.ceil(100 * ((playerCorners - opponentCorners) / (playerCorners + opponentCorners)));
	}*/

	computeBoardMapScore(board, playerColor, opponentColor) {

		let weight = [200 , -100, 100,  50,  50, 100, -100,  200,
		-100, -200, -50, -50, -50, -50, -200, -100,
		100 ,  -50, 100,   0,   0, 100,  -50,  100,
		50  ,  -50,   0,   0,   0,   0,  -50,   50,
		50  ,  -50,   0,   0,   0,   0,  -50,   50,
		100 ,  -50, 100,   0,   0, 100,  -50,  100,
		-100, -200, -50, -50, -50, -50, -200, -100,
		200 , -100, 100,  50,  50, 100, -100,  200];


		//si les coins sont pris, 1/4 des poids perdent leur effet
		if (!board.isEmptyCell(0, 0)) {
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j <= 3; j++) {
					weight[i + j * 8] = 0;
				}
			}
		}

		if (!board.isEmptyCell(0, 7)) {
			for (let i = 0; i < 3; i++) {
				for (let j = 4; j <= 7; j++) {
					weight[i + j * 8] = 0;
				}
			}
		}

		if (!board.isEmptyCell(7, 0)) {
			for (let i = 5; i < 8; i++) {
				for (let j = 0; j <= 3; j++) {
					weight[i + j * 8] = 0;
				}
			}
		}

		if (!board.isEmptyCell(7, 7)) {
			for (let i = 5; i < 8; i++) {
				for (let j = 4; j <= 7; j++) {
					weight[i + j * 8] = 0;
				}
			}
		}

		let playerScore = 0;
		let opponentScore = 0;

		for (let y = 0; (y < board.height); y++) {
			for (let x = 0; (x < board.width); x++) {
				const pawn = board.getPawnAt(x, y)
				if (pawn.color === playerColor) {
					playerScore += weight[x + y * 8];
				} else if (pawn.color === opponentColor) {
					opponentScore += weight[x + y * 8];
				}
			}
		}

		return  (playerScore + opponentScore) === 0 ? 0 : Math.ceil(100 * ((playerScore - opponentScore) / (playerScore + opponentScore)));
	}

	cornerGrab(board, playerColor) {
		const playerMoves = board.getValidMoves(playerColor);

		for (const pos in playerMoves) {
			if ((pos.x === 0) && (pos.y === 0)) { return 1000; }
			if ((pos.x === 7) && (pos.y === 0)) { return 1000; }
			if ((pos.x === 0) && (pos.y === 7)) { return 1000; }
			if ((pos.x === 7) && (pos.y === 7)) { return 1000; }
		}
		return 0;
	}

	edgeGrab(board, playerColor) {
		const playerMoves = board.getValidMoves(playerColor);

		for (const pos in playerMoves) {
			if ((pos.x !== 0) && (pos.x !== 7) && (pos.y === 0)) { return 100; }
			if ((pos.x !== 0) && (pos.x !== 7) && (pos.y === 7)) { return 100; }
			if ((pos.y !== 0) && (pos.y !== 7) && (pos.x === 0)) { return 100; }
			if ((pos.y !== 0) && (pos.y !== 7) && (pos.x === 7)) { return 100; }
		}
		return 0;
	}


	comparePosition(object, value) {
		return ((object.x === value.x) && (object.y === value.y));
	}

	getFrontierSquaresScore(board, pawnColor) {
		  const playerColor = (pawnColor === PawnColor.WHITE) ? PawnColor.BLACK : PawnColor.WHITE;
		  const possibleFrontiers = new Array();

			for (let x = 0; x < board.width; x++) {
				for (let y = 0; y < board.height; y++) {
					if ((!board.isEmptyCell(x, y)) && (board.getPawnAt(x,y).color === playerColor)) {

						// verification dans les 8 directions
						if ((x > 0) && (board.isEmptyCell(x - 1, y))) { possibleFrontiers.push(new Position(x - 1, y)); }
						if ((x < 7) && (board.isEmptyCell(x + 1, y))) { possibleFrontiers.push(new Position(x + 1, y)); }
						if ((y > 0) && (board.isEmptyCell(x, y - 1))) { possibleFrontiers.push(new Position(x, y - 1)); }
						if ((y < 7) && (board.isEmptyCell(x, y + 1))) { possibleFrontiers.push(new Position(x, y + 1)); }
						if ((x > 0) && (y > 0) && (board.isEmptyCell(x - 1, y - 1))) { possibleFrontiers.push(new Position(x - 1, y - 1)); }
						if ((x > 0) && (y < 7) && (board.isEmptyCell(x - 1, y + 1))) { possibleFrontiers.push(new Position(x - 1, y + 1)); }
						if ((x < 7) && (y > 0) && (board.isEmptyCell(x + 1, y - 1))) { possibleFrontiers.push(new Position(x + 1, y - 1)); }
						if ((x < 7) && (y < 7) && (board.isEmptyCell(x + 1, y + 1))) { possibleFrontiers.push(new Position(x + 1, y + 1)); }
					}
				}
			}
			return removeDuplicateObjectFromArray(possibleFrontiers, this.comparePosition).length;
	}

	computeFrontierScore(board, playerColor, opponentColor) {
		const playerScore =  this.getFrontierSquaresScore(board, opponentColor);
		const opponentScore =  this.getFrontierSquaresScore(board, playerColor);

		return  (playerScore + opponentScore) === 0 ? 0 : Math.ceil(100 * ((playerScore - opponentScore) / (playerScore + opponentScore)));
	}

	evaluateScore(board, playerColor) {
		const opponentColor = (playerColor === PawnColor.WHITE) ? PawnColor.BLACK : PawnColor.WHITE;

		//const cornerParity = this.computeCornerParityScore(board, playerColor); ou oppenentColor
		const mobility = this.computeMobilityScore(board, playerColor, opponentColor);
		const parity = this.computeParityScore(board, playerColor, opponentColor);
		const boardMap =  this.computeBoardMapScore(board, playerColor, opponentColor);
		//const frontiers = this.computeFrontierScore(board, playerColor, opponentColor);
		const cornerGrab = this.cornerGrab(board, playerColor);
		const edgeGrab = this.edgeGrab(board, playerColor)

		return   (100 * cornerGrab) + (10 * edgeGrab) +  mobility +  boardMap +  parity;
	}

	/**
	 *
	 * @param { ReversiBoard } board
	 * @param { PawnColor }playerColor
	 * @param { PawnColor }currentColor
	 * @param { Number } depth
	 * @param { Number }maxDepth
	 * @param { Number }alpha
	 * @param { Number }beta
	 * @return { Number }
	 */
	miniMaxAlphaBeta(board, playerColor, currentColor, depth = 1, maxDepth = 7, alpha = -100000, beta = 100000) {

		if ((depth === maxDepth) || board.isGameOver(false)) {
			return this.evaluateScore(board, playerColor);
		}

		const availableMoves = board.getValidMoves(currentColor);
		const opponentColor = (playerColor === PawnColor.WHITE) ? PawnColor.BLACK : PawnColor.WHITE;

		if (availableMoves.length === 0) {
			return this.miniMaxAlphaBeta(board, playerColor, opponentColor, depth + 1, maxDepth,  alpha, beta);
		}

		let bestValue = (playerColor === currentColor) ? -Infinity : Infinity; //-1000000 : 1000000;
    for (const move of availableMoves) {
	    const tempBoard = board.clone();
			tempBoard.makeMove(currentColor, move.x, move.y, false);
	    const value = this.miniMaxAlphaBeta(tempBoard, playerColor, opponentColor, depth + 1, maxDepth,  alpha, beta);
			if (playerColor === currentColor) {  // maximize
				if(value > bestValue) {
					bestValue = value;
				}
				//alpha = Math.max(alpha, bestValue);
				if (bestValue > alpha) {
					alpha = bestValue;
				}
				if (beta <= alpha) {
					//bestValue = value;
					break;
				}
			} else {  // Minimize
				if(value < bestValue) {
					bestValue = value;
				}
				//beta = Math.min(beta, bestValue);
				if (bestValue < beta) {
					beta = bestValue;
				}
				if (beta <= alpha) {
					//bestValue = value;
					break;
				}
			}
		}
		return bestValue;
	}

	/**
	 * Retourne le meilleur coup possible
	 * @param { PawnColor } playerColor
	 * @return { Position }
	 */
	getBestMove(playerColor) {
		return new Promise((resolve, _reject) => {
			let bestValue = -Infinity; //-100000;
			let bestMove = null;
			const availableMoves = this.board.getValidMoves(playerColor);
			const opponentColor = (playerColor === PawnColor.WHITE) ? PawnColor.BLACK : PawnColor.WHITE;

			if (availableMoves.length > 0) {
				shuffleArray(availableMoves);
				for (const move of availableMoves) {
					const tempBoard = this.board.clone();
					tempBoard.makeMove(playerColor, move.x, move.y, false);
					const value = this.miniMaxAlphaBeta(tempBoard, playerColor, opponentColor);

					if (value > bestValue) {
						bestValue = value;
						bestMove = move;
					}
				}
				resolve(bestMove);
			}
		});
	}
}

export class ReversiEngineAI_Factory {
  static factory(board, engineAIType) {
		switch (engineAIType) {
			case ReversiAIEngine.MINMAX :
				return new Reversi_Minmax_AI_adapter(board);
				break;
			case ReversiAIEngine.MINMAX_ALPHABETA :
				return new Reversi_MinmaxAlphaBetaPrunning_AI_adapter(board);
				break;
			default :
				return new Reversi_MinmaxAlphaBetaPrunning_AI_adapter(board);
				break;
		}
  }
}