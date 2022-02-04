import CustomEngineAI_adapter from '../lib/gameengine/engineai.js';
import {PawnColor} from "./reversigameengine.js";
import { shuffleArray} from "../lib/core/utils.js";

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
		//return playerCount - opponentCount;
		return Math.ceil(100 * ((playerCount - opponentCount) / (playerCount + opponentCount)));
	}

	computeMobilityScore(board, playerColor, opponentColor) {
		const playerMoves = board.getValidMoves(playerColor).length;
		const opponentMoves = board.getValidMoves(opponentColor).length;
		//return 100 * (playerMoves   - opponentMoves);
		return  (playerMoves + opponentMoves) === 0 ? 0 : Math.ceil(100 * ((playerMoves - opponentMoves)/(playerMoves + opponentMoves)));
	}

	computeCornerScore(board, playerColor, opponentColor) {
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
		} else {
			playerCorners++;
		}

		if (!board.isEmptyCell(7, 0)) {
			const pawn = board.getPawnAt(7,0);
			if (pawn.color === playerColor) {
				playerCorners++;
			}
			else  {
				opponentCorners++;
			}
		} else {
			playerCorners++;
		}

		if (!board.isEmptyCell(0, 7)) {
			const pawn = board.getPawnAt(0,7);
			if (pawn.color === playerColor) {
				playerCorners++;
			}
			else  {
				opponentCorners++;
			}
		} else {
			playerCorners++;
		}

		if (!board.isEmptyCell(7, 7)) {
			const pawn = board.getPawnAt(7,7);
			if (pawn.color === playerColor) {
				playerCorners++;
			}
			else  {
				opponentCorners++;
			}
		} else {
			playerCorners++;
		}

		return  (playerCorners + opponentCorners) === 0 ? 0 : Math.ceil(100 * ((playerCorners - opponentCorners) / (playerCorners + opponentCorners)));
		//return 1000 * (playerCorners - opponentCorners);
	}

	evaluateScore(board, playerColor) {
		const opponentColor = (playerColor === PawnColor.WHITE) ? PawnColor.BLACK : PawnColor.WHITE;
		const corner = this.computeCornerScore(board, playerColor, opponentColor);
		const mobility = this.computeMobilityScore(board, playerColor, opponentColor);
		const parity = this.computeParityScore(board, playerColor, opponentColor);
		//return  corner + mobility + parity;
		return corner + mobility + parity;
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

		let bestValue = (playerColor === currentColor) ? -1000000 : 1000000;
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
			let bestValue = -100000;
			let bestMove = null;
			const availableMoves = this.board.getValidMoves(playerColor);
			const opponentColor = (playerColor === PawnColor.WHITE) ? PawnColor.BLACK : PawnColor.WHITE;
			// console.log("GET BEST MOVE COLOR = ", playerColor);
			// console.log("Available Moves = ", availableMoves.length);
			if (availableMoves.length > 0) {
				shuffleArray(availableMoves);
				for (const move of availableMoves) {
					// console.log("MOVE = ", move);
					const tempBoard = this.board.clone();
					tempBoard.makeMove(playerColor, move.x, move.y, false);
					const value = this.miniMaxAlphaBeta(tempBoard, playerColor, opponentColor);
					// console.log("BestValue = ", bestValue);
					// console.log("Value = ", value);
					if (value > bestValue) {
						bestValue = value;
						bestMove = move;
						// console.log("NEW BESTMOVE = ", bestMove);
					}
				}
				// console.log("BESTMOVE = ", bestMove);
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