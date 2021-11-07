// Enumeration de l'etat d'une case
const CellState = {
	BLANK      : 0,
	PLAYER1    : 1,
	PLAYER2    : 2,
	PLAYER1WIN : 3,
	PLAYER2WIN : 4,
};

// Enumeration du type d'adversaire
const VersusPlayerType = {
	HUMAN    : 0,
	COMPUTER : 1
};

// Enumeration du niveau de l'IA
const ComputerLevelIA = {
	EASY   : 0,
	MEDIUM : 1,
	HARD   : 2,
	EXPERT : 3
};

// Enumeration du joueur
const PlayerState = {
	PLAYER1 : 0,
	PLAYER2 : 1
};

// Enumeration de la stratégie globale de l'IA
const ComputerStrategy = {
	ATTACK : 0,
	DEFEND : 1,
	CANWIN : 2,
	NORMAL : 3
};

// Enumeration de la stratégie d'attaque de l'IA
const AttackStrategy = {
	NONE          : 0,
	CENTER_CROSS  : 1,
	CENTER_CORNER : 2,
	CORNER_CORNER : 3,
	CORNER_CROSS  : 4,
	CORNER_CENTER : 5,
	CROSS_CENTER  : 6,
	CROSS_CORNER  : 7
};

// Enumeration de la ligne d'attaque de l'IA
const StrategyMode = {
	NONE           : 0,
	HORIZONTAL     : 1,
	VERTICAL       : 2,
	DIAGONAL_LEFT  : 3,
	DIAGONAL_RIGHT : 4
};

//====================================================================================================

let versus;                            // Type de match Humain vs Humain ou Humain vs Ordinateur
let levelIA;                           // Niveau de l'intelligence artificielle
let isWin = false;                     // Drapeau pour savoir si il y a un gagnant
let remainHits;                        // Nombre de coup restant
let gameBoard;                         // plateau de jeu 3 cases par 3
let firstPlayer;                       // Joueur qui commence à jouer @see PlayerState
let currentPlayer;                     // Joueur en cours @see PlayerState
let scores = new Array(3);             // Tableau du score des joueurs: idx:0 = joueur 1, idx:1 = joueur 2, idx:3 = matchs nul
// let totalMatch;                        // Nombre de manche totale
// let currentMatch;                      // Manche en cours
let lastAttackStrategy                 // Dernière strategie d'attaque de l'IA @see AttackStrategy
let playerOneIcon;
let playerTwoIcon;
let playerIcon;

// Dernières position joué par les joueurs (Utilisé uniquement avec jeu contre l'ordinateur)
let lastPlayer1Pos = {col:-1, row:-1};
let lastPlayer2Pos = {col:-1, row:-1};

//====================================================================================================

/**
 * Retourne un nombre aléatoire entre min et max compris
 * @return Int
 */
function randomRange(min=10, max=30) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Effectue une pause d'une durée en ms
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Effectue un effet de fondu arrière (disparition) sur un élément
 */
function fadeOut(el, duration = 2000) {
	let last = new Date();
	function _fade() {
		let val = parseFloat(el.style.opacity);
		let step = (new Date() - last) / duration;
		if ((val -= step) >= 0) {
			el.style.opacity = val;
			(window.requestAnimationFrame && requestAnimationFrame(_fade)) || setTimeout(_fade, 16);
		}
		else {
			el.style.display = "none";
		}
	}
	el.style.opacity = 1;
	_fade();
}

/**
 * Effectue un effet de fondu avant (apparition) sur un élément
 */
function fadeIn(el, defaultStyle = "block", duration=2000) {
	let last = new Date();
	function _fade() {
		let val = parseFloat(el.style.opacity);
		let step = (new Date() - last) / duration;
		if ((val += step) <= 1.0) {
			el.style.opacity = val;
			(window.requestAnimationFrame && requestAnimationFrame(_fade)) || setTimeout(_fade, 16);
		}
	}
	el.style.opacity = 0;
	el.style.display = defaultStyle;
	_fade();
}

/**
 * Initialisation du tableau de jeu
 * @PRIVATE
 */
function _createGameBoard() {
	let array2D = new Array(3);
	for(let i = 0; i < array2D.length; i++) {
		array2D[i] = new Array(3);
		for(let j = 0; j < array2D[i].length; j++) {
			array2D[i][j] = CellState.BLANK;
		}
	}
	return array2D;
}

/**
 * Remise à zero du tableau de jeu
 * @PRIVATE
 */
function _clearGameBoard() {
	for(let i = 0; i < gameBoard.length; i++) {
		for(let j = 0; j < gameBoard[i].length; j++) {
			gameBoard[i][j] = CellState.BLANK;
		}
	}
}

/**
 * Retourne le numero de la case du plateau de jeu entre 0 et 8 en fonction
 * de la position x,y dans le tableau de jeu
 * @PRIVATE
 * @param INT x
 * @param INT y
 * @return INT
 */
function _getCellID(x,y) {
	return ((Number(y) * 3) + Number(x));
}

/**
 * Vérifie et retourne une valeur > -1 si le joueur a gagné
 * @PRIVATE
 * @param INT player : numéro du joueur @see PlayerState
 * @return INT : -1 pas de victoire si non retourne
 *   11, 12, 13 = ligne gagnante
 *   21, 22, 23 = colonne gagnante
 *   30, 40     = diagonale gagnante
 */
function _checkIfPlayerWin(player) {
	let checkState;
	let code = -1;
	if (player === PlayerState.PLAYER1) {
		checkState = CellState.PLAYER1;
	}
	else {
		checkState = CellState.PLAYER2;
	}
	if ((gameBoard[0][0] === checkState) && (gameBoard[0][1] === checkState) && (gameBoard[0][2] === checkState)) {
		code = 11;
	}
	else if ((gameBoard[1][0] === checkState) && (gameBoard[1][1] === checkState) && (gameBoard[1][2] === checkState)) {
		code = 11;
	}
	else if ((gameBoard[2][0] === checkState) && (gameBoard[2][1] === checkState) && (gameBoard[2][2] === checkState)) {
		code = 13;
	}
	else if ((gameBoard[0][0] === checkState) && (gameBoard[1][0] === checkState) && (gameBoard[2][0] === checkState)) {
		code = 21;
	}
	else if ((gameBoard[0][1] === checkState) && (gameBoard[1][1] === checkState) && (gameBoard[2][1] === checkState)) {
		code = 22;
	}
	else if ((gameBoard[0][2] === checkState) && (gameBoard[1][2] === checkState) && (gameBoard[2][2] === checkState)) {
		code = 23;
	}
	else if ((gameBoard[0][0] === checkState) && (gameBoard[1][1] === checkState) && (gameBoard[2][2] === checkState)) {
		code = 30;
	}
	else if ((gameBoard[0][2] === checkState) && (gameBoard[1][1] === checkState) && (gameBoard[2][0] === checkState)) {
		code = 40;
	}
	return code;
}

/**
 * Affichage d'une ligne gagnante : horizontale
 * @PRIVATE
 */
function _displayWinCol(code) {
	let col;
	switch (code) {
		case 11:
			col = 0;
			break;
		case 12:
			col = 1;
			break;
		case 13:
			col = 2;
			break;
	}
	for (let i = 0; i == 2; i++) {
		if (currentPlayer === PlayerState.PLAYER1) {
			gameBoard[col][i] = CellState.PLAYER1WIN;
		}
		else {
			gameBoard[col][i] = CellState.PLAYER2WIN;
		}
	}
}

/**
 * Affichage d'une ligne gagnante : verticale
 * @PRIVATE
 */
function _displayWinRow(code) {
	let row;
	switch (code) {
		case 21:
			row = 0;
			break;
		case 22:
			row = 1;
			break;
		case 23:
			row = 2;
			break;
	}
	for (let i = 0; i == 2; i++) {
		if (currentPlayer === PlayerState.PLAYER1) {
			gameBoard[i][row] = CellState.PLAYER1WIN;
		}
		else {
			gameBoard[i][row] = CellState.PLAYER2WIN;
		}
	}
}

/**
 * Affichage d'une ligne gagnante : diagonale
 * @PRIVATE
 */
function _displayWinDiag(code) {
	switch (code) {
		case 30:
			for (let i = 0; i == 2; i++) {
				if (currentPlayer === PlayerState.PLAYER1) {
					gameBoard[i][i] = CellState.PLAYER1WIN;
				}
				else {
					gameBoard[i][i] = CellState.PLAYER2WIN;
				}
			}
			break;
		case 40:
			for (let i = 2; i == 0; i--) {
				if (currentPlayer === PlayerState.PLAYER1) {
					gameBoard[i][2 - i] = CellState.PLAYER1WIN;
				}
				else {
					gameBoard[i][2 - i] = CellState.PLAYER2WIN;
				}
			}
			break;
	}
}

/**
 * Affichage d'une ligne gagnante : Horizontale, verticale ou diagonale
 * @PRIVATE
 */
function _displayAnimWin(code) {
	switch (code) {
		case 11:
		case 12:
		case 13:
			_displayWinCol(code);
			break;
		case 21:
		case 22:
		case 23:
			_displayWinRow(code);
			break;
		case 30:
		case 40:
			_displayWinDiag(code);
			break;
	}
}

/**
 * Assignation du signe X ou O en fonction du choix dans le menu
 */
function setSignChoosed(sign) {
	if (sign === 'X') {
		playerOneIcon = 'X';
		playerTwoIcon = 'O';
	}
	else {
		playerOneIcon = 'O';
		playerTwoIcon = 'X';
	}
}

/**
 * Intelligence artificielle - jeu de l'ordinateur
 * 4 Niveaux @see ComputerLevelIA :
 *  - Facile (joue tous les coups au hasard)
 *  - Moyen (Sait comment défendre et gagner. Joue les coups au hasard)
 *  - Difficile (Sait comment défendre et gagner. Détermine les coups avec l'algorithme "MinMax" )
 *  - Expert (Analyse complète du jeu et des coups. Bonne chance pour gagner ! )
 * @PRIVATE
 */
async function _computerPlaying() {
	let row, col;
	let nodes;
	let hSum = new Array(3);
	let vSum = new Array(3);
	let dSum = new Array(2);
	let horizontalAttackRow;
	let verticalAttackCol;
	let strategyGlobal;
	let strategyMode;
	let strategyAttack;
	let playerHit;
	let lastComputerHit;
	let lastAttackStrategy;
	let playStrategy;

	/**
	 * Joue le coup
	 */
	function play() {
		return new Promise(resolve => {
			gameBoard[col][row] = CellState.PLAYER2;
			lastPlayer2Pos.col = col;
			lastPlayer2Pos.row = row;
			let cellID = _getCellID(col, row);
			let selector = `#cell${cellID}`;
			let cell = document.querySelector(selector);
			cell.textContent = playerTwoIcon;
			if (playerTwoIcon === "O") {
				cell.classList.add('cell--circle');
			}
			else {
				cell.classList.add('cell--cross');
			}
			cell.removeEventListener("mouseenter", handleCellMouseEnter);
			cell.removeEventListener("mouseleave", handleCellMouseLeave);
			cell.removeEventListener("click", handleCellMouseClick);
		});
	}

	/**
	 * Joue au hazard
	 */
	async function playHazard() {
		do {
			col = randomRange(0, 2);
			row = randomRange(0, 2);
		} while (gameBoard[col][row] !== CellState.BLANK);
		// console.log('computer play hazard : ');
		// console.log('col : ', col);
		// console.log('row : ', row);
		await play();
	}

	/**
	 * Joue le premier coup
	 */
	async function playFirst() {
		let firstHit = randomRange(0,4);
		switch (firstHit) {
			case 0:
				col = 0;
				row = 0;
				break;
			case 1:
				col = 2;
				row = 0;
				break;
			case 2:
				col = 1;
				row = 1;
				break;
			case 3:
				col = 0;
				row = 2;
				break;
			case 4:
				col = 2;
				row = 2;
				break;
		}
		await play();
	}

	/**
	 * Evalue le meilleur coup avec l'algorithme minimax, possible et le joue
	 * https://fr.wikipedia.org/wiki/Algorithme_minimax
	 */
	async function playMinMax() {
		/**
		 * Verifie si il y encore un coup à jouer
		 */
		function isMovesLeft(board) {
			for(let i = 0; i < 3; i++) {
				for(let j = 0; j < 3; j++) {
					if (board[i][j] === CellState.BLANK) { return true; }
				}
			}
			return false;
		}

		/**
		 * Evaluation de la grille de jeu et retourne un score
		 */
		function evaluateBoard(board) {
			// Vérification si gagné en horizontal
			for(let row = 0; row < 3; row++) {
				if (board[0][row] === board[1][row] && board[1][row] === board[2][row]) {
					if (board[row][0] === CellState.PLAYER2) {
						return +10;
					}
					else if (board[0][row] === CellState.PLAYER1) {
						return -10;
					}
				}
			}

			// Vérification si gagné en vertical
			for(let col = 0; col < 3; col++) {
				if (board[col][0] === board[col][1] && board[col][1] === board[col][2]) {
					if (board[col][0] == CellState.PLAYER2) {
						return +10;
					}
					else if (board[col][0] === CellState.PLAYER1) {
						return -10;
					}
				}
			}

			// Vérification si gagné en diagonal
			if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
				if (board[0][0] === CellState.PLAYER2) {
					return +10;
				}
				else if (board[0][0] === CellState.PLAYER1) {
					return -10;
				}
			}

			if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
				if (board[0][2] === CellState.PLAYER2) {
					return +10;
				}
				else if (board[0][2] === CellState.PLAYER1) {
					return -10;
				}
			}
			return 0;
		}

		/**
		 * Algorithle minimax pour trouvé le meilleur coup possible
		 */
		function minimax(board, depth, isMax) {
			// On fait une copie du tableau de jeu à 2 dimensions
			let tmpBoard = board.map(function(arr) {
				return arr.slice();
			});

			// On évalue le score
			let score = evaluateBoard(tmpBoard);


			// Si le joueur en cours a gagné on retourne le score
			if (score == 10) { return score; }

			// Si l'opposant a gagné, on retourne le score
			if (score == -10) { return score; }

			// Si il n'y a plus de coup à jouer et si il n'y' a pas de gangnant alors c'est un match nul
			if (isMovesLeft(tmpBoard) == false) { return 0; }

			// C'est au joueur en cours de jouer
			if (isMax) {
				let best = -1000;

				// Pour toutes les cases
				for(let i = 0; i < 3; i++) {
					for(let j = 0; j < 3; j++) {
						// On vérifie que la case est vide
						if (tmpBoard[i][j] === CellState.BLANK) {
							// On joue
							tmpBoard[i][j] = CellState.PLAYER2;
							// On appel récursivement la fonction MiniMax et on choisie le score maximum
							best = Math.max(best, minimax(tmpBoard, depth + 1, !isMax));
							// On annule le coup
							tmpBoard[i][j] = CellState.BLANK;
						}
					}
				}
				return best;
			}
			else { // C'est au tour de l'opposant
				let best = 1000;
				// Pour toutes les cases
				for(let i = 0; i < 3; i++) {
					for(let j = 0; j < 3; j++) {
						// On vérifie que la case est vide
						if (tmpBoard[i][j] === CellState.BLANK) {
							// Make the move
							tmpBoard[i][j] = CellState.PLAYER1;
							// On appel récursivement la fonction MiniMax et on choisie le score minimum
							best = Math.min(best, minimax(tmpBoard, depth + 1, !isMax));
							// On annule le coup
							tmpBoard[i][j] = CellState.BLANK;
						}
					}
				}
				return best;
			}
		}

		/**
		 * Retourne et joue le meilleur coup possible
		 */
		function findBestMove(board) {
			let bestVal = -1000;
			let bestMove = {col:-1, row:-1};

			// Pour toutes les case vide on évalue le meilleur coup possible avec la fonction minimax
			// On retourne la case à jouer et le score optimal
			for(let i = 0; i < 3; i++) {
				for(let j = 0; j < 3; j++) {
					// On vérifie que la case est vide
					if (board[i][j] === CellState.BLANK) {
						// Make the move
						board[i][j] = CellState.PLAYER2;
						// On évalue le score de la case jouée avec la fonction minimax
						let moveVal = minimax(board, 0, false);
						// On annule le coup
						board[i][j] = CellState.BLANK;

						// Si le score du coup en cours est meilleur que la valeur précedente, on met à jour celle-ci
						if (moveVal > bestVal) {
							bestMove.row = j;
							bestMove.col = i;
							bestVal = moveVal;
						}
					}
				}
			}
			// On retoure la position du meilleur coup
			return bestMove;
		}

		let bestMove = findBestMove(gameBoard);
		col = bestMove.col;
		row = bestMove.row;
		await play();
	}

	/**
	 * Analyse la grille de jeu et joue le coup pour défendre ou gagner
	 */
	async function playForWinOrDefend() {
		switch (strategyMode) {
			case StrategyMode.DIAGONAL_LEFT :
				if (nodes[0][0] === -1) {
					row = 0;
					col = 0;
				}
				else if (nodes[1][1] === -1) {
					row = 1;
					col = 1;
				}
				else if (nodes[2][2] === -1) {
					row = 2;
					col = 2;
				}
				break;

			case StrategyMode.DIAGONAL_RIGHT :
				if (nodes[2][0] === -1) {
					row = 0;
					col = 2;
				}
				else if (nodes[1][1] === -1) {
					row = 1;
					col = 1;
				}
				else if (nodes[0][2] === -1) {
					row = 2;
					col = 0;
				}
				break;

			case StrategyMode.HORIZONTAL :
				for (let i = 0; i < 3; i++) {
					if (nodes[i][row] === -1) {
						col = i;
						break;
					}
				}
				break;

			case StrategyMode.VERTICAL :
				for (let i = 0; i < 3; i++) {
					if (nodes[col][i] === -1) {
						row = i;
						break;
					}
				}
				break;
		}
		await play();
	}

	/**
	 * Evalue la grille de jeu et choisie une strategie d'attaque
	 */
	async function playAttack() {
		console.log("play Attack");
		console.log("Last player hit col = ",lastPlayer1Pos.col)
		console.log("Last player hit row = ",lastPlayer1Pos.row)
		playerHit = _getCellID(lastPlayer1Pos.col, lastPlayer1Pos.row);
		console.log("PLAYER HIT = ", playerHit);
		console.log("REMAIN HITS = ", remainHits);

		function evaluateAttackStrategy() {
			console.log("Evaluate Attack Strategy");
			strategyAttack = AttackStrategy.NONE;

			if (firstPlayer === PlayerState.PLAYER2) { // l'ordinateur à joué le premier
				console.log("l'ordinateur à joué le premier")
				if (remainHits === 7) { // Deuxieme tour
					// L'ordinateur a joué la case du centre au premier tour
					if (_getCellID(lastPlayer2Pos.col, lastPlayer2Pos.row) === 4) {
						console.log("L'ordinateur a joué la case du centre au premier tour");
						// le joueur 1 a joué dans les coins. Il y a plus de 90% de chance que le match se termine sur un match nul
						if ((playerHit === 0) || (playerHit === 2) ||
							(playerHit === 6) || (playerHit === 8)) {
							strategyAttack = AttackStrategy.CENTER_CORNER;
							console.log("le joueur 1 a joué dans les coins. Il y a plus de 90% de chance que le match se termine sur un match nul");
							console.log("AttackStrategy = CENTER_CORNER");
							/*
								1 | . | 3
								---------
								. | o | .
								---------
								7 | . | 9
							*/
						}
						else { // le joueur a joué verticalement ou horizontalement. Le joueur a perdu d'avance :)
							strategyAttack = AttackStrategy.CENTER_CROSS;
							console.log("AttackStrategy = CENTER_CROSS");
							/*
								. | 2 | .
								---------
								4 | o | 6
								---------
								. | 8 | .
							*/
						}
					}
					else { // L'ordinateur a joué dans les coins au premier tour
						console.log("L'ordinateur a joué dans les coins au premier tour");
						// le joueur 1 a joué dans le centre
						if (playerHit === 4) {
							console.log("le joueur 1 a joué dans le centre");
							console.log("AttackStrategy = CORNER_CENTER");
							strategyAttack = AttackStrategy.CORNER_CENTER;
						}
						else if ((playerHit === 0) || (playerHit === 2) ||
							(playerHit === 6) || (playerHit === 8)) {
							console.log("le joueur 1 a joué dans les coins");
							console.log("AttackStrategy = CORNER_CORNER");
							strategyAttack = AttackStrategy.CORNER_CORNER; ;
						}
						else {
							console.log("le joueur 1 a joué en horizontal ou vertical");
							strategyAttack = AttackStrategy.CORNER_CROSS;
							console.log("AttackStrategy = CORNER_CROSS");
						}
					}
				}
				//lastAttackStrategy = strategyAttack;
				else {
					// contre
					console.log("CONTRE");
				}
			}
		}
		// Notes : Les minuscules o et x désigne les tours déja joués. Les majuscules O et X désignes le tour en cours
		// x ou X désigne le joueur 1 - o ou O désigne l'ordinateur. Les . désignent les cases vide

		if (remainHits === 7) { // Deuxieme tour
			evaluateAttackStrategy();
			console.log("strategyAttack = ", strategyAttack);
			switch (strategyAttack) {
				case AttackStrategy.NONE :
					playMinMax();
					break;

				case AttackStrategy.CENTER_CORNER :  // Possibilité de gagné dans 2 tours, suivant le choix du joueur 1
					lastAttackStrategy = AttackStrategy.CENTER_CORNER;
					lastComputerHit = _getCellID(lastPlayer2Pos.col, lastPlayer2Pos.row);
					switch (playerHit) {
						case 0 :
							/*
									x | . | .
									---------
									. | o | .
									---------
									. | . | O
								*/
							row = 2;
							col = 2;
							break;
						case 2 :
							/*
									. | . | x
									---------
									. | o | .
									---------
									O | . | .
								*/
							row = 2;
							col = 0;
							break;
						case 8 :
							/*
									O | . | .
									---------
									. | o | .
									---------
									. | . | x
								*/
							row = 0;
							col = 0;
							break;
						case 6 :
							/*
									. | . | O
									---------
									. | o | .
									---------
									x | . | .
								*/
							row = 0;
							col = 2;
							break;
					}
					await play();
					break;

				case AttackStrategy.CENTER_CROSS :   // Le joueur 1 perd dans 2 tours. Il est obligé de défendre.
					lastAttackStrategy = AttackStrategy.CENTER_CROSS;
					lastComputerHit = _getCellID(lastPlayer2Pos.col, lastPlayer2Pos.row);
					switch (playerHit) {
						case 1 :
							/*
								. | x | .
								---------
								. | o | .
								---------
								. | . | O
							*/
							row = 2;
							col = 2;
							break;
						case 5 :
							/*
								. | . | .
								---------
								. | o | x
								---------
								O | . | .
							*/
							row = 2;
							col = 0;
							break;
						case 7 :
							/*
								O | . | .
								---------
								. | o | .
								---------
								. | x | .
							*/
							row = 0;
							col = 0;
							break;
						case 3 :
							/*
								. | . | O
								---------
								x | o | .
								---------
								. | . | .
							*/
							row = 0;
							col = 2;
							break;
					}
					await play();
					break;

				case AttackStrategy.CORNER_CORNER :
					// L'ordinateur à joué un des coins
					// le joueur 1 à joué un des 3 autres coins, on l'oblige à défendre et on gagne au prochain tour
					lastAttackStrategy = AttackStrategy.CORNER_CORNER;
					lastComputerHit = _getCellID(lastPlayer2Pos.col, lastPlayer2Pos.row);
					switch (lastComputerHit) {
						case 0 :  // l'ordinateur a joué le coin en haut à gauche
							switch (playerHit) {
								case 2 :
									/*
										 o | . | X         o | . | O        o | . | O
										 ---------         ---------        ---------
										 . | . | .   ou    . | . | .  ou    . | . | .
										 ---------         ---------        ---------
										 O | . | .         X | . | .        . | . | X
									*/
									row = 2;
									col = 0;
									break;
								case 6 :
									row = 0;
									col = 2;
									break;
								case 8 :
									row = 0;
									col = 2;
									break;
							}
							break;
						case 2 :  // l'ordinateur a joué le coin en haut à droite
							switch (playerHit) {
								case 0 :
									/*
										 X | . | o         . | . | o        O | . | o
										 ---------         ---------        ---------
										 . | . | .   ou    . | . | .  ou    . | . | .
										 ---------         ---------        ---------
										 . | . | O         X | . | O        . | . | X
									*/
									row = 2;
									col = 2;
									break;
								case 6 :
									row = 2;
									col = 2;
									break;
								case 8 :
									row = 0;
									col = 0;
									break;
							}
							break;

						case 6 :  // l'ordinateur a joué le coin en bas à gauche
							switch (playerHit) {
								case 0 :
									/*
										 X | . | .         O | . | X        O | . | .
										 ---------         ---------        ---------
										 . | . | .   ou    . | . | .  ou    . | . | .
										 ---------         ---------        ---------
										 o | . | O         o | . | .        o | . | X
									*/
									row = 2;
									col = 2;
									break;
								case 2 :
									row = 0;
									col = 0;
									break;
								case 8 :
									row = 0;
									col = 0;
									break;
							}
							break;

						case 8 :  // l'ordinateur a joué le coin en bas à droite
							switch (playerHit) {
								case 0 :
									/*
										 X | . | O         . | . | X        . | . | O
										 ---------         ---------        ---------
										 . | . | .   ou    . | . | .  ou    . | . | .
										 ---------         ---------        ---------
										 . | . | o         O | . | o        X | . | o
									*/
									row = 0;
									col = 2;
									break;
								case 2 :
									row = 2;
									col = 0;
									break;
								case 6 :
									row = 0;
									col = 2
									break;
							}
							break;
					}
					await play();
					break;

				case AttackStrategy.CORNER_CENTER :
					// L'ordinateur va jouer le coin opposé en diagonale. Possibilité de gagner dans 2 tours suivant le choix du joueur 1
					lastAttackStrategy = AttackStrategy.CORNER_CENTER;
					lastComputerHit = _getCellID(lastPlayer2Pos.col, lastPlayer2Pos.row);
					switch (lastComputerHit) {
						case 0 :  // l'ordinateur a joué le coin en haut à gauche
							row = 2;
							col = 2;
							break;
						case 2 :  // l'ordinateur a joué le coin en haut à droite
							row = 2;
							col = 0;
							break;
						case 6 :  // l'ordinateur a joué le coin en bas à gauche
							row = 0;
							col = 2;
							break;
						case 8 :  // l'ordinateur a joué le coin en bas à droite
							row = 0;
							col = 0;
							break;
					}
					await play();
					break;

				case AttackStrategy.CORNER_CROSS :
					// Le joueur 1 a joué horizontalement ou verticalement. On l'oblige à défendre et on gagne dans 2 tours
					lastAttackStrategy = AttackStrategy.CORNER_CROSS;
					lastComputerHit = _getCellID(lastPlayer2Pos.col, lastPlayer2Pos.row);
					switch (lastComputerHit) {
						case 0 :  // l'ordinateur a joué le coin en haut à gauche
							/*
								 o | X | .        o | . | O
								 ---------        ---------
								 . | . | .        X | . | .
								 ---------        ---------
								 O | . | .        . | . | .
							*/
							if (playerHit === 1) {
								row = 2;
								col = 0;
							}
							else if (playerHit === 3) {
								row = 0;
								col = 2;
							}
							break;
						case 2 :  // l'ordinateur a joué le coin en haut à droite
							/*
								 O | . | o        . | X | o
								 ---------        ---------
								 . | . | X        . | . | .
								 ---------        ---------
								 . | . | .        . | . | O
							*/
							if (playerHit === 1) {
								row = 2;
								col = 2;
							}
							else if (playerHit === 5) {
								row = 0;
								col = 0;
							}
							break;
						case 6 :  // l'ordinateur a joué le coin en bas à gauche
							/*
								 . | . | .        O | . | .
								 ---------        ---------
								 X | . | .        . | . | .
								 ---------        ---------
								 o | . | O        o | X | .
							*/
							if (playerHit === 3) {
								row = 2;
								col = 2;
							}
							else if (playerHit === 7) {
								row = 0;
								col = 0;
							}
							break;
						case 8 :  // l'ordinateur a joué le coin en bas à droite
							/*
								 . | . | .        . | . | O
								 ---------        ---------
								 . | . | X        . | . | .
								 ---------        ---------
								 O | . | o        . | X | o
							*/
							if (playerHit === 5) {
								row = 2;
								col = 0;
							}
							else if (playerHit === 7) {
								row = 0;
								col = 2;
							}
							break;
					}
					await play();
					break;
				default :
					playHazard();
					break;
			}
		}
		else if (remainHits === 5) { // Troisième tour
			evaluateAttackStrategy();
			lastComputerHit = _getCellID(lastPlayer2Pos.col, lastPlayer2Pos.row);
			switch (strategyAttack) {
				case AttackStrategy.CENTER_CORNER : // Suivant le coup du joueur 1, il a perdu d'avance :)
					switch (lastComputerHit) {
						case 8 :
							if (playerHit === 5) {
								/*
								 x | . | .        x | . | .
								 ---------        ---------
								 . | o | X   ou   . | o | X
								 ---------        ---------
								 O | . | o        . | O | o

								 Si le joueur 1 joue l'opposé. La défense est automatique et le joueur 1 perd au prochain tour

								 x | . | .
								 ---------
								 X | o | .
								 ---------
								 O | . | o
							*/
								playStrategy = randomRange(0, 1);
								if (playStrategy === 0) {
									row = 2;
									col = 0;
								}
								else {
									row = 2;
									col = 1;
								}
								await play();
							}
							else if (playerHit === 7) {
								/*
								 x | . | O        x | . | .
								 ---------        ---------
								 . | o | .   ou   . | o | O
								 ---------        ---------
								 . | X | o        . | X | o

								 Si le joueur 1 joue l'opposé. La défense est automatique et le joueur 1 perd au prochain tour

								 x | X | O
								 ---------
								 . | o | .
								 ---------
								 . | . | o
							*/
								playStrategy = Random(0, 1);
								if (playStrategy === 0) {
									row = 0;
									col = 2;
								}
								else {
									row = 1;
									col = 2;
								}
								await play();
							}
							else { // C'est le match nul assuré
								playHazard();
							}
							break;
						case 0 :
							if (gameBoard[0,1] === CellState.PLAYER1) { //  Le joueur 1 a perdu d'avance :)
								/*
								 o | . | O        o | O | .
								 ---------        ---------
								 X | o | .   ou   X | o | .
								 ---------        ---------
								 . | . | x        . | . | x

								 Si le joueur 1 joue l'opposé. La défense est automatique et le joueur 1 perd au prochain tour

									o | . | O
									---------
									. | o | X
									---------
									. | . | x
							 */
								playStrategy = randomRange(0, 1);
								if (playStrategy === 0) {
									row = 0;
									col = 2;
								}
								else {
									row = 0;
									col = 1;
								}
								await play();
							}
							else if (gameBoard[1,0] === CellState.PLAYER1) { //  Le joueur 1 a perdu d'avance :)
								/*
								 o | X | .        o | X | .
								 ---------        ---------
								 . | o | .   ou   O | o | .
								 ---------        ---------
								 O | . | x        . | . | x

								 Si le joueur 1 joue l'opposé. La défense est automatique et le joueur 1 perd au prochain tour

								 o | . | .
								 ---------
								 . | o | .
								 ---------
								 O | X | x
							*/
								playStrategy = randomRange(0,1);
								if (playStrategy === 0) {
									row = 2;
									col = 0;
								}
								else {
									row = 1;
									col = 0;
								}
								await play();
							}
							else { // C'est le match nul assuré
								playHazard();
							}
							break;
						case 2 :
							if (gameBoard[2,1] === CellState.PLAYER1) { //  Le joueur 1 a perdu d'avance :)
								/*
									 O | . | o        . | O | o
									 ---------        ---------
									 . | o | X   ou   . | o | X
									 ---------        ---------
									 x | . | .        x | . | .

									 Si le joueur 1 joue l'opposé. La défense est automatique et le joueur 1 perd au prochain tour

									 O | . | o
									 ---------
									 X | o | .
									 ---------
									 x | . | .
								*/
								playStrategy = randomRange(0, 1);
								if (playStrategy === 0) {
									row = 0;
									col = 0;
								}
								else {
									row = 0;
									col = 1;
								}
								await play();
							}
							else if (gameBoard[1,0] === CellState.PLAYER1) { //  Le joueur 1 a perdu d'avance :)
								/*
									 . | X | o        . | X | o
									 ---------        ---------
									 . | o | .   ou   . | o | O
									 ---------        ---------
									 x | . | O        x | . | .

									 Si le joueur 1 joue l'opposé. La défense est automatique et le joueur 1 perd au prochain tour

									 . | . | o
									 ---------
									 . | o | .
									 ---------
									 x | X | O
								*/
								PlayStrategy = randomRange(0, 1);
								if (PlayStrategy === 0) {
									row = 2;
									col = 2;
								}
								else {
									row = 1;
									col = 2;
								}
								await play();
							}
							else { // C'est le match nul assuré
								playHazard();
							}
							break;
						case 6 :
							if (gameBoard[0,1] === CellState.PLAYER1) { //  Le joueur 1 a perdu d'avance :)
								/*
									 . | . | x
									 ---------
									 X | o | .
									 ---------
									 o | . | O

									 Si le joueur 1 joue l'opposé. La défense est automatique et le joueur 1 perd au prochain tour

									 . | . | x
									 ---------
									 . | o | X
									 ---------
									 o | . | O
								 */
								row = 2;
								col = 2;
								await play();
							}
							else if (gameBoard[1,2] === CellState.PLAYER1) { //  Le joueur 1 a perdu d'avance :)
								/*
									 O | . | x        . | . | x
									 ---------        ---------
									 . | o | .   ou   O | o | .
									 ---------        ---------
									 o | X | .        o | X | .

									 Si le joueur 1 joue l'opposé. La défense est automatique et le joueur 1 perd au prochain tour

									 O | X | x
									 ---------
									 . | o | .
									 ---------
									 o | . | .
								*/
								playStrategy = randomRange(0, 1);
								if (playStrategy === 0) {
									row = 0;
									col = 0;
								}
								else {
									row = 1;
									col = 0;
								}
								await play();
							}
							else { // C'est le match nul assuré
								playHazard();
							}
							break;
					}
					break;
				// asCornerCenter : Le joueur 1 a joué un des coins en attaque. Il est contré automatiquement et perd au tour suivant
				// Si le joueur 1 a joué horizontalement ou verticalement. Le match nul est quasi assuré
				/*
					o | . | O        o | . | X
					---------        ---------
					. | x | .   ou   . | x | .
					---------        ---------
					X | . | o        O | . | o

					O | . | o        X | . | o
					---------        ---------
					. | x | .   ou   . | x | .
					---------        ---------
					o | . | X        o | . | O
				*/

//         case AttackStrategy.CORNER_CROSS :
//           // Le joueur 1 est obligé de défendre. On place notre pion pour gagner au prochain tour
//           /*
//               o | x | .        o | X | o
//               ---------        ---------
//               X | . | .        x | . | .
//               ---------        ---------
//               o | . | O        . | . | O

//               o | X | o        . | x | o
//               ---------        ---------
//               . | . | x        . | . | X
//               ---------        ---------
//               O | . | .        O | . | o

//               O | . | .        O | . | o
//               ---------        ---------
//               . | . | x        . | . | X
//                 ---------        ---------
//               o | X | o        . | x | o

//               . | . | O        o | . | O
//               ---------        ---------
//               x | . | .        X | . | .
//               ---------        ---------
//               o | X | o        o | x | .
//             */
//           play();
//           break;
				default :
					playMinMax();
					break;
			}
		}
		else {
			playMinMax();
		}
	}

	/**
	 * Evalue la strategie global à jouer
	 */
	function evaluateStrategy() {
		console.log('Evaluate Strategy')
		// return new Promise(resolve => {
		let x, y, i;
		col = -1;
		row = -1;
		dSum[0] = 0;
		dSum[1] = 0;
		nodes = new Array(3);
		for (let x = 0; x < 3; x++) {
			nodes[x] = new Array(3);
			for (let y = 0; y < 3; y++) {
				nodes[x][y] = -1;
			}
		}

		// Remplissage du tableau Nodes en fonction de l'etat des case du plateau de jeu ( -1 : Vide, 1 : Joueur 1, 4 : Ordinateur )
		for (let y = 0; y < 3; y++) {
			hSum[y] = 0;
			vSum[y] = 0;
			for (let x = 0; x < 3; x++) {
				let cellValue = gameBoard[x][y];
				if (cellValue === CellState.BLANK) {
					nodes[x][y] = -1;
				}
				else if (cellValue === CellState.PLAYER1) {
					nodes[x][y] = 1;
				}
				else if (cellValue === CellState.PLAYER2) {
					nodes[x][y] = 4;
				}
			}
		}

		// Somme des valeurs du tableau Nodes horizontalement, verticalement et en diagonale
		// Cette somme permettra de déterminer le choix de la stratégie globale ( attaque, défense, coup gagnant )
		dSum[0] = nodes[0][0] + nodes[1][1] + nodes[2][2];
		dSum[1] = nodes[2][0] + nodes[1][1] + nodes[0][2];
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 3; x++) {
				hSum[y] = hSum[y] + nodes[x][y];
				vSum[x] = vSum[x] + nodes[x][y];
			}
		}

		strategyMode = StrategyMode.NONE;


		// Choix de la strategie pour les lignes en diagonale
		for (let i = 0; i < 2; i++) {
			if (dSum[i] === 7) {
				strategyGlobal = ComputerStrategy.CANWIN;
				console.log('1) Evaluate Strategy = CANWIN')
				if (i === 0) {
					strategyMode = StrategyMode.DIAGONAL_LEFT;
				}
				else {
					strategyMode = StrategyMode.DIAGONAL_RIGHT;
				}
				break;
			}
			else if (dSum[i] === 1) {
				strategyGlobal = ComputerStrategy.DEFEND;
				console.log('1) Evaluate Strategy = DEFEND')
				if (i === 0) {
					strategyMode = StrategyMode.DIAGONAL_LEFT;
				}
				else {
					strategyMode = StrategyMode.DIAGONAL_RIGHT;
				}
				break;
			}
			else if (dSum[i] === 2) {
				strategyGlobal = ComputerStrategy.ATTACK;
				console.log('1) Evaluate Strategy = ATTACK')
			}
			else {
				strategyGlobal = ComputerStrategy.NORMAL;
				console.log('1) Evaluate Strategy = NORMAL')
			}
		}

		// Choix de la strategie pour les lignes horizontale
		if ((strategyGlobal === ComputerStrategy.NORMAL) || (strategyGlobal === ComputerStrategy.ATTACK)) {
			for (let i = 0; i < 3; i++) {
				if (hSum[i] === 7) {
					strategyGlobal = ComputerStrategy.CANWIN;
					console.log('2) Evaluate Strategy = CANWIN')
					strategyMode = StrategyMode.HORIZONTAL;
					//horizontalAttackRow = i;
					row = i;
					break;
				}
				else if (hSum[i] === 1) {
					strategyGlobal = ComputerStrategy.DEFEND;
					console.log('2) Evaluate Strategy = DEFEND')
					strategyMode = StrategyMode.HORIZONTAL;
					//horizontalAttackRow = i;
					row = i;
					break;
				}
				else if (hSum[i] === 2) {
					strategyGlobal = ComputerStrategy.ATTACK;
					console.log('2) Evaluate Strategy = ATTACK')
				}
				else {
					if (strategyGlobal !== ComputerStrategy.ATTACK) { strategyGlobal = ComputerStrategy.NORMAL; console.log('2) Evaluate Strategy = NORMAL') }

				}
			}
		}

		// Choix de la strategie pour les lignes verticale
		if ((strategyGlobal === ComputerStrategy.NORMAL) || (strategyGlobal === ComputerStrategy.ATTACK)) {
			for (let i = 0; i < 3; i++) {
				if (vSum[i] === 7) {
					strategyGlobal = ComputerStrategy.CANWIN;
					console.log('3) Evaluate Strategy = CANWIN')
					strategyMode = StrategyMode.VERTICAL;
					col = i
					break;
				}
				else if (vSum[i] === 1) {
					strategyGlobal = ComputerStrategy.DEFEND;
					console.log('3) Evaluate Strategy = DEFEND')
					strategyMode = StrategyMode.VERTICAL;
					col = i;
					break;
				}
				else if (vSum[i] === 2) {
					strategyGlobal = ComputerStrategy.ATTACK;
					console.log('3) Evaluate Strategy = ATTACK')
				}
				else {
					if (strategyGlobal !== ComputerStrategy.ATTACK) { strategyGlobal = ComputerStrategy.NORMAL; console.log('3) Evaluate Strategy = NORMAL')}
				}
			}
		}
		console.log('===== Evaluate Strategy == ', strategyGlobal);
		//});
	}

	// Choix du niveau de l'IA
	switch (levelIA) {
		case ComputerLevelIA.EASY:
			playHazard();
			break;

		case ComputerLevelIA.MEDIUM:
			if ((firstPlayer === PlayerState.PLAYER2) && (remainHits === 9)) {
				playFirst();
			}
			else {
				evaluateStrategy();
				if ((strategyGlobal === ComputerStrategy.CANWIN) || (strategyGlobal === ComputerStrategy.DEFEND)) {
					playForWinOrDefend();
				}
				else {
					playHazard();
				}
			}
			break;

		case ComputerLevelIA.HARD:
			if ((firstPlayer === PlayerState.PLAYER2) && (remainHits === 9)) {
				playFirst();
			}
			else {
				evaluateStrategy();
				if ((strategyGlobal === ComputerStrategy.CANWIN) || (strategyGlobal === ComputerStrategy.DEFEND)) {
					playForWinOrDefend();
				}
				else {
					playMinMax();
				}
			}
			break;

		case ComputerLevelIA.EXPERT:
			if ((firstPlayer === PlayerState.PLAYER2) && (remainHits === 9)) {
				playFirst();
			}
			else {
				evaluateStrategy();
				if ((strategyGlobal === ComputerStrategy.CANWIN) || (strategyGlobal === ComputerStrategy.DEFEND)) {
					console.log('Defend or Win');
					playForWinOrDefend();
				}
				else if (strategyGlobal === ComputerStrategy.ATTACK) {
					console.log('Attack');
					playAttack();
				}
				else {
					console.log('MinMax');
					playMinMax();
				}
			}
			break;
	}
}

//===================================================================================================
// PROGRAMME PRINCIPAL
//===================================================================================================

// sections
const menuCtrl = document.querySelector('#menu');
const boardCtrl = document.querySelector('#board');
// Menus
const chooseOpponent = document.querySelector('#chooseOpponent');
const chooseLevelIA = document.querySelector('#chooseLevelIA');
const chooseSign = document.querySelector('#chooseSign');
// Boutons
const btnVsPlayer = document.querySelector('#vsPlayer');
const btnVsComputer = document.querySelector('#vsComputer');
const btnChoiceX = document.querySelector('#choiceX');
const btnChoiceO = document.querySelector('#choiceO');
const btnChoiceBack = document.querySelector('#choiceBack');
const btnLevelEasy = document.querySelector('#levelEasy');
const btnLevelMedium = document.querySelector('#levelMedium');
const btnLevelHard = document.querySelector('#levelHard');
const btnLevelExpert = document.querySelector('#levelExpert');
const btnBackOpponent = document.querySelector('#backOpponent');
const btnBackToMenu = document.querySelector('#backToMenu');
// labels
const lblScoreX = document.querySelector('#scoreX');
const lblScoreO = document.querySelector('#scoreO');
const lblScoreDraws = document.querySelector('#scoreDraws');
const lblPlayerTurn = document.querySelector('#playerTurn');
// modal
const modalBox = document.querySelector('#modalBox');
const modalMsg = document.querySelector('.notification__message');

//--------------------------------------------------------------------------------------------

/**
 * Mise à jour de l'affichage du score
 */
function updateScore() {
	lblScoreX.textContent = scores[0];
	lblScoreO.textContent = scores[1];
	lblScoreDraws.textContent = scores[2];
}

/**
 * Joueur humain
 */
function playerTurn() {
	if (currentPlayer === PlayerState.PLAYER1) {
		lblPlayerTurn.textContent = "player 1's turn";
		playerIcon = playerOneIcon;
	}
	else {
		lblPlayerTurn.textContent = "player 2's turn";
		playerIcon = playerTwoIcon;
	}
}

/**
 * Joueur ordinateur
 */
function computerTurn() {
	_computerPlaying();
}

/**
 * Initialisation du jeu
 */
function initGame() {
	gameBoard = _createGameBoard();
	lastPlayer1Pos = {col:-1, row:-1};
	lastPlayer2Pos = {col:-1, row:-1};
	remainHits = 9;
	currentPlayer = firstPlayer;
	playerIcon = 'X';
	scores[0] = 0;
	scores[1] = 0;
	scores[2] = 0;
	updateScore();
	const emptyCells = document.querySelectorAll('.cell:empty');
	emptyCells.forEach((el) => {
		el.addEventListener('mouseenter', handleCellMouseEnter);
		el.addEventListener('mouseleave', handleCellMouseLeave);
		el.addEventListener('click', handleCellMouseClick);
	});
}

/**
 * Ré-initialisation du jeu
 */
function resetGame() {
	_clearGameBoard();
	remainHits = 9;
	lastPlayer1Pos = {col:-1, row:-1};
	lastPlayer2Pos = {col:-1, row:-1};
	const cells = document.querySelectorAll('.cell');
	cells.forEach((el) => {
		el.removeEventListener('mouseenter', handleCellMouseEnter);
		el.removeEventListener('mouseleave', handleCellMouseLeave);
		el.removeEventListener('click', handleCellMouseClick);
		el.textContent = "";
		el.classList.remove('cell--cross');
		el.classList.remove('cell--circle');
		el.addEventListener('mouseenter', handleCellMouseEnter);
		el.addEventListener('mouseleave', handleCellMouseLeave);
		el.addEventListener('click', handleCellMouseClick);
	});
}

/**
 * Initialisation de la manche suivante
 */
async function nextMatch() {
	resetGame();

	if (firstPlayer === PlayerState.PLAYER1) {
		firstPlayer = PlayerState.PLAYER2;
		playerIcon = playerTwoIcon;
	}
	else {
		firstPlayer = PlayerState.PLAYER1;
		playerIcon = playerOneIcon;
	}
	currentPlayer = firstPlayer;

	if (versus === VersusPlayerType.HUMAN ) {
		playerTurn();
	}
	else {
		if (firstPlayer === PlayerState.PLAYER2) {
			currentPlayer = PlayerState.PLAYER2;
			lblPlayerTurn.textContent = "player 2's turn";
			await sleep(1000); // une petite pause de 1 secondes;
			computerTurn();
			--remainHits;
			currentPlayer = PlayerState.PLAYER1;
			playerTurn();
		}
		else {
			currentPlayer = PlayerState.PLAYER1;
			playerTurn();
		}
	}
}

//--------------------------------------------------------------------------------------------

// gestionnaires d'évènements
function handleCellMouseEnter(evt) {
	let el = evt.currentTarget;
	if ((versus === VersusPlayerType.HUMAN) || ((versus === VersusPlayerType.COMPUTER) && (currentPlayer === PlayerState.PLAYER1))) {
		el.style.cursor ="pointer";
		el.textContent = playerIcon;

		if (playerIcon === "X") {
			el.classList.add("cell--cross");
		}
		else {
			el.classList.add("cell--circle");
		}
	}
}

async function handleCellMouseClick(evt) {
	let el = evt.currentTarget;
	let aRow = el.dataset.row;
	let aCol = el.dataset.col;

	function drawCell(sign) {
		el.textContent = sign;
		if (sign === "X") {
			el.classList.add("cell--cross");
		}
		else {
			el.classList.add("cell--circle");
		}
		el.removeEventListener("mouseenter", handleCellMouseEnter);
		el.removeEventListener("mouseleave", handleCellMouseLeave);
		el.removeEventListener("click", handleCellMouseClick);
	}

	el.style.cursor ="default";
	if (remainHits > 0) {
		if (versus === VersusPlayerType.COMPUTER) {
			if (gameBoard[aCol][aRow] === CellState.BLANK) {
				gameBoard[aCol][aRow] = CellState.PLAYER1;
				playerIcon = playerOneIcon;
				drawCell(playerIcon);
				--remainHits;
				lastPlayer1Pos.row = aRow;
				lastPlayer1Pos.col = aCol;
				isWin = (_checkIfPlayerWin(currentPlayer) > 0);
			}
			if (!isWin && (remainHits > 0)) {
				currentPlayer = PlayerState.PLAYER2;
				lblPlayerTurn.textContent = "player 2's turn";
				await sleep(1000); // une petite pause de 1 secondes;
				computerTurn();
				--remainHits;
				//console.log('REMAIN HITS', remainHits);
				isWin = (_checkIfPlayerWin(currentPlayer) > 0);
			}
		}
		else {
			if (gameBoard[aCol][aRow] === CellState.BLANK) {
				if (currentPlayer === PlayerState.PLAYER1) {
					gameBoard[aCol][aRow] = CellState.PLAYER1;
				}
				else {
					gameBoard[aCol][aRow] = CellState.PLAYER2;
				}
				drawCell(playerIcon);
				remainHits--;
				isWin = (_checkIfPlayerWin(currentPlayer) > 0);
			}
		}
	}

	if (isWin === true) {
		let msg;
		if (currentPlayer === PlayerState.PLAYER1 ) {
			msg = 'Player 1 win';
			if (playerOneIcon === "X") {
				scores[0] = ++scores[0];
			}
			else {
				scores[1] = ++scores[1];
			}
		}
		else {
			msg = 'Player 2 win';
			if (playerTwoIcon === "O") {
				scores[1] = ++scores[1];
			}
			else {
				scores[0] = ++scores[0];
			}
		}
		modalMsg.textContent = msg;
		modalBox.classList.add('notification--show');
		const timeOut = setTimeout(()=> {
			modalBox.classList.remove('notification--show');
			updateScore();
			nextMatch();
			clearTimeout(timeOut);
		}, 3000);

	}
	else if (remainHits > 0) {
		if (versus !== VersusPlayerType.COMPUTER) {
			if (currentPlayer === PlayerState.PLAYER1) {
				currentPlayer = PlayerState.PLAYER2
			}
			else {
				currentPlayer = PlayerState.PLAYER1;
			}
			playerTurn();
		}
		else {
			currentPlayer = PlayerState.PLAYER1;
			playerTurn();
		}
	}
	else {
		scores[2] = ++scores[2];
		modalMsg.textContent = "It's a draw";
		modalBox.classList.add('notification--show');
		const timeOut = setTimeout(()=> {
			modalBox.classList.remove('notification--show');
			updateScore();
			nextMatch()
			clearTimeout(timeOut);
		}, 3000);
	}
}

function handleCellMouseLeave(evt) {
	let el = evt.currentTarget;
	if ((versus === VersusPlayerType.HUMAN) || ((versus === VersusPlayerType.COMPUTER) && (currentPlayer === PlayerState.PLAYER1))) {
		el.textContent = "";
		el.classList.remove("cell--circle");
		el.classList.remove("cell--cross");
		el.style.cursor ="none";
	}
}

//--------------------------------------------------------------------------------------------

// Assignation des gestionnaires d'évènements
btnVsPlayer.addEventListener("click", () => {
	fadeOut(chooseOpponent);
	fadeIn(chooseSign);
	versus = VersusPlayerType.HUMAN;
})

btnVsComputer.addEventListener("click", () => {
	fadeOut(chooseOpponent);
	fadeIn(chooseLevelIA);
	versus = VersusPlayerType.COMPUTER;
})

btnBackOpponent.addEventListener("click", () => {
	fadeOut(chooseLevelIA);
	fadeIn(chooseOpponent);
})

btnLevelEasy.addEventListener("click", () => {
	fadeOut(chooseLevelIA);
	fadeIn(chooseSign);
	levelIA = ComputerLevelIA.EASY;
})

btnLevelMedium.addEventListener("click", () => {
	fadeOut(chooseLevelIA);
	fadeIn(chooseSign);
	levelIA = ComputerLevelIA.MEDIUM;
})

btnLevelHard.addEventListener("click", () => {
	fadeOut(chooseLevelIA);
	fadeIn(chooseSign);
	levelIA = ComputerLevelIA.HARD;
})

btnLevelExpert.addEventListener("click", () => {
	fadeOut(chooseLevelIA);
	fadeIn(chooseSign);
	levelIA = ComputerLevelIA.EXPERT;
})

btnChoiceBack.addEventListener("click", () => {
	fadeOut(chooseSign);
	fadeIn(chooseOpponent);
})

btnChoiceX.addEventListener("click", () => {
	fadeOut(chooseSign);
	fadeIn(boardCtrl, "flex");
	menuCtrl.style.display ="none";
	setSignChoosed("X");
	firstPlayer = PlayerState.PLAYER1;
	currentPlayer = PlayerState.PLAYER1;
	initGame();
	playerTurn();
})

btnChoiceO.addEventListener("click", () => {
	fadeOut(chooseSign);
	fadeIn(boardCtrl, "flex");
	menuCtrl.style.display ="none";
	setSignChoosed("O");
	firstPlayer = PlayerState.PLAYER1;
	currentPlayer = PlayerState.PLAYER1;
	initGame();
	if (versus === VersusPlayerType.HUMAN ) {
		playerTurn();
	}
	else {
		lblPlayerTurn.textContent = "player 2's turn";
		computerTurn();
		--remainHits;
		currentPlayer = PlayerState.PLAYER1;
		playerTurn();
	}
})

btnBackToMenu.addEventListener("click", () => {
	fadeOut(boardCtrl);
	setTimeout(() =>{
		menuCtrl.style.display ="block";
		fadeIn(chooseOpponent);
	}, 500)

})

console.clear();