export default class CustomEngineAI_adapter {
  constructor(board) {
		this.board = board;
  }

	getBestMove() {
		throw new Error("You must impleted this function in children")
	}
}