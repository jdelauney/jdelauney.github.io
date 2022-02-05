import {PawnColor, PlayerType, ReversiGameEngine} from "./reversigameengine.js";
import {Counter} from "../lib/counter.js";
import {wait, waitForDOMEvent} from "../lib/core/utils.js";

export default class ReversiGame {
	constructor() {
		this.reversiEngine = new ReversiGameEngine();

		this.gameMenucontainer = document.getElementById("gameMenu__container");

		this.toggleMenuRadio = document.getElementById("tab-zero");
		this.gameMenu_part_intro = document.getElementById("gameMenuIntro");

		this.gameBoardContainer = document.getElementById("gameBoard__container");
		this.gameBoard = document.getElementById("gameBoard");

		this.btn_play = document.getElementById("button_play");
		this.btn_rules = document.getElementById("button_rules");
		this.btn_infos = document.getElementById("button_infos");
		this.btn_backToMenu = document.getElementById("button_backToMenu");

		this.playerTurnLabel = document.getElementById("playerTurnLabel");

		this.btnStartGameHumanVsHuman = document.getElementById("button_startGameHumanVsHuman");
		this.btnStartGameHumanVsComputer = document.getElementById("button_startGameHumanVsComputer");

		this.modal = document.getElementById("modal");
		this.modalContent = document.getElementById("modal__box-content");
		this.modalFooter =  document.getElementById("modal__box-footer");
		this.modalHeader = document.getElementById("modal__box-header");

		this.initEvents();
	}

	displayRulesClickHandler() {
		this.btn_rules.classList.add('button--active');
		this.btn_play.classList.remove('button--active');
		this.btn_infos.classList.remove('button--active');
	}

	displayInfosClickHandler() {
		this.btn_infos.classList.add('button--active');
		this.btn_play.classList.remove('button--active');
		this.btn_rules.classList.remove('button--active');
	}

	playClickHandler() {
		this.btn_play.classList.add('button--active');
		this.btn_rules.classList.remove('button--active');
		this.btn_infos.classList.remove('button--active');
	}

	backToMenuClickHandler() {
		this.gameMenucontainer.classList.remove("hide");
		this.gameBoardContainer.classList.remove("show");
		this.gameMenu_part_intro.classList.add("show");
	}

	cellClickHandler(event) {
		const cell = event.currentTarget;
		if (cell.hasAttributes("data-valid")) {
			const x = Number(cell.getAttribute("data-col"));
			const y = Number(cell.getAttribute("data-row"));
			this.reversiEngine.makeMove(x,y);
		}
	}

	modalBoxButtonsClickHandler(event) {
		const action = event.currentTarget.getAttribute("data-action");
		this.modalBoxButtonsAction = Number(action);
	}

	initGameBoard() {
		for (let y = 0; y < this.reversiEngine.board.height; y++) {
			for (let x = 0; x < this.reversiEngine.board.width; x++) {
				const newCell = document.createElement('div');
				newCell.className = 'cell';
				newCell.setAttribute('data-col', x.toString());
				newCell.setAttribute('data-row', y.toString());
				newCell.setAttribute('data-state', "empty");
				const pawn = document.createElement('div');
				pawn.className = 'pawn';
				const currentPawn = this.reversiEngine.board.getPawnAt(x, y);
				if ((currentPawn !== null) && (currentPawn !== undefined)) {
					if (currentPawn.color === PawnColor.WHITE) {
						pawn.className += " pawn--white";
						newCell.setAttribute('data-state', "white");
					} else if (currentPawn.color === PawnColor.BLACK) {
						pawn.className += " pawn--black";
						newCell.setAttribute('data-state', "black");
					}
				}
				newCell.appendChild(pawn);
				this.gameBoard.appendChild(newCell);
			}
		}
		this.cells = this.gameBoard.querySelectorAll(".cell");
		this.cells.forEach((cell) => {
			cell.addEventListener("click", this.cellClickHandler.bind(this));
		})
	}

	clearGameBoard() {
		while (this.gameBoard.firstChild) {
			this.gameBoard.removeChild(this.gameBoard.firstChild);
		}
	}

	displayScore() {
		const playerOneCount = this.reversiEngine.players[0].getScore();
		const playerTwoCount = this.reversiEngine.players[1].getScore();

		if (this.reversiEngine.players[0].pawnColor === PawnColor.WHITE) {
			this.scorePlayerOne.start(Number(document.getElementById("scorePlayerOne").innerText), playerOneCount);
			this.scorePlayerTwo.start(Number(document.getElementById("scorePlayerTwo").innerText), playerTwoCount);
		}
		else {
			this.scorePlayerTwo.start(Number(document.getElementById("scorePlayerOne").innerText), playerTwoCount);
			this.scorePlayerOne.start(Number(document.getElementById("scorePlayerTwo").innerText), playerOneCount);
		}
	}

	displayPlayerTurn() {
		this.playerTurnLabel.innerHTML = `<b>Tour :&nbsp;</b>${this.reversiEngine.currentPlayer.name}`;
	}

	updateBoard() {
		this.cells.forEach((cell) => {
			if (cell.hasAttributes("data-valid")) {
				cell.removeAttribute("data-valid");
			}
		});

		const availableMoves = this.reversiEngine.board.getValidMoves(this.reversiEngine.currentPlayer.pawnColor);
		if (availableMoves.length > 0) {
			availableMoves.forEach((move) => {
				const cellIndex = this.reversiEngine.board.getCellIndex(move.x, move.y);
				this.cells[cellIndex].setAttribute("data-valid", "true");
			})
		}
	}

	newGame() {
		this.reversiEngine.startGame();
	}

	clearModalBox() {
		this.modalHeader.innerHTML = "";
		this.modalContent.innerHTML = "";
		this.modalFooter.innerHTML = "";
	}

	showModalBox() {
		this.modal.classList.add("open");
	}

	hideModalBox() {
		this.modal.classList.remove("open");
	}

	createInputPlayerName(labelText, idName, placeHolder) {
		const inputRow = document.createElement("div");
		inputRow.className = "inputRow";
		const label = document.createElement("label");
		label.setAttribute("for", idName);
		label.innerHTML = labelText + "&nbsp;";
		const inputEl = document.createElement("input");
		inputEl.setAttribute("type", "text");
		inputEl.setAttribute("id", idName);
		inputEl.setAttribute("placeholder", placeHolder);
		inputRow.appendChild(label);
		inputRow.appendChild(inputEl);
		return inputRow;
	}

	createModalButton(labelText) {
		const newButton = document.createElement("span");
		newButton.className = "button button--small";
		newButton.setAttribute("data-title", labelText);
		newButton.setAttribute("role", "button");
		newButton.textContent = labelText;
		return newButton;
	}

	async openModal(title, content, showCloseButton = true, autoclose = true,  closeDelay = 5000 ) {
		this.clearModalBox();

		let closeButton = null;

		if (title !== "") {
			const titleElement = document.createElement("h2");
			titleElement.textContent = title;
			this.modalHeader.appendChild(titleElement);
		}

		if (showCloseButton) {
			closeButton = this.createModalButton("Fermer");
			this.modalFooter.appendChild(closeButton)
		}

		this.modalContent.innerHTML = content;

		this.showModalBox();

		if (autoclose) {
			if (showCloseButton) {
					let timer;
					const timeOut = (time) => {
						return Promise.race([
							waitForDOMEvent(closeButton, "click"),
							new Promise((resolve, _reject) => timer = setTimeout(resolve, time))
						]).finally(() => clearTimeout(timer));
					}
					await timeOut(closeDelay);
			}
			else {
				await wait(closeDelay);
			}
		}
		else {
			if (showCloseButton) {
				await waitForDOMEvent(closeButton, "click")
			}
		}

		this.hideModalBox();
		this.clearModalBox();
	}

	async askPlayersName() {
		this.clearModalBox();

		const titleElement = document.createElement("h2");
		titleElement.textContent = "Entrez le nom des joueurs";
		this.modalHeader.appendChild(titleElement);

		const inputRowOne = this.createInputPlayerName("Joueur 1 :", "inputNameOne","Jhon");
		this.modalContent.appendChild(inputRowOne);

		const inputRowTwo = this.createInputPlayerName("Joueur 2 :", "inputNameTwo","Jane");
		this.modalContent.appendChild(inputRowTwo);

		const infoText = document.createElement("p");
		infoText.style.width = "100%";
		infoText.style.textAlign = "center";
		infoText.innerHTML = "Le <b>joueur 1</b> à les <b>pions noir</b>.<br>Il <b>débutera la partie</b>"
		this.modalContent.appendChild(infoText);

		const cancelButton = this.createModalButton("Annuler");
		cancelButton.setAttribute("data-action", "0");
		cancelButton.addEventListener("click", this.modalBoxButtonsClickHandler.bind(this));
		this.modalFooter.appendChild(cancelButton);

		const validateButton = this.createModalButton("Valider");
		validateButton.setAttribute("data-action", "1");
		validateButton.addEventListener("click", this.modalBoxButtonsClickHandler.bind(this));
		this.modalFooter.appendChild(validateButton);

		this.showModalBox();

		const promise = await Promise.race([
			waitForDOMEvent(cancelButton, "click"),
			waitForDOMEvent(validateButton, "click"),
		]);

		if (this.modalBoxButtonsAction === 1) {
			this.reversiEngine.players[0].name = (inputNameOne.value !== "") ? inputNameOne.value : "Jhon";
			this.reversiEngine.players[1].name = (inputNameTwo.value !== "") ? inputNameTwo.value : "Jane";
		}

		this.hideModalBox();
		this.clearModalBox();

		return promise;
	}

	async askSettingsPlayerVsComputer() {
		this.clearModalBox();

		const titleElement = document.createElement("h2");
		titleElement.textContent = "Options";
		this.modalHeader.appendChild(titleElement);

		const inputRowOne = this.createInputPlayerName("Joueur 1 :", "inputNameOne","Jhon");
		this.modalContent.appendChild(inputRowOne);

		const cancelButton = this.createModalButton("Annuler");
		cancelButton.setAttribute("data-action", "0");
		cancelButton.addEventListener("click", this.modalBoxButtonsClickHandler.bind(this));
		this.modalFooter.appendChild(cancelButton);

		const validateButton = this.createModalButton("Valider");
		validateButton.setAttribute("data-action", "1");
		validateButton.addEventListener("click", this.modalBoxButtonsClickHandler.bind(this));
		this.modalFooter.appendChild(validateButton);


		this.showModalBox();

		const promise = await Promise.race([
			waitForDOMEvent(cancelButton, "click"),
			waitForDOMEvent(validateButton, "click"),
		]);
		if (this.modalBoxButtonsAction === 1) {
			this.reversiEngine.players[0].name = (inputNameOne.value !== "") ? inputNameOne.value : "Jhon";
		}

		this.hideModalBox();
		this.clearModalBox();

		return promise;
	}

	async displayGameOverBox(winner) {
		this.clearModalBox();

		const titleElement = document.createElement("h2");
		titleElement.textContent = "Fin de partie";
		this.modalHeader.appendChild(titleElement);

		const winnerName = (this.reversiEngine.players[0].pawnColor === winner) ? this.reversiEngine.players[0].name : this.reversiEngine.players[1].name;
		this.modalContent.innerHTML = `<p style="width:100%; text-align: center">Le joueur <b>${winnerName}</b> a gagné la partie !</p>`;

		const backToMenuButton = this.createModalButton("Menu");
		backToMenuButton.setAttribute("data-action", "0");
		backToMenuButton.addEventListener("click", this.modalBoxButtonsClickHandler.bind(this));
		this.modalFooter.appendChild(backToMenuButton);

		const replayButton = this.createModalButton("Rejouer");
		replayButton.setAttribute("data-action", "1");
	  replayButton.addEventListener("click", this.modalBoxButtonsClickHandler.bind(this));
		this.modalFooter.appendChild(replayButton);

		this.showModalBox();

		const promise = await Promise.race([
			waitForDOMEvent(backToMenuButton, "click"),
			waitForDOMEvent(replayButton, "click"),
		]);

		this.hideModalBox();
		this.clearModalBox();

		if (this.modalBoxButtonsAction === 0) {
			this.backToMenuClickHandler();
		}
		else {
			this.newGame();
		}

		return promise;
	}

	doOnPutPawn(pawn) {
		const cellIndex = this.reversiEngine.board.getCellIndex(pawn.position.x, pawn.position.y);
		const pawnClass =  (pawn.color === PawnColor.WHITE) ? "pawn--white" : "pawn--black";
		const dataState =  (pawn.color === PawnColor.WHITE) ? "white" : "black";
		this.cells[cellIndex].removeAttribute("data-valid");
		this.cells[cellIndex].setAttribute("data-state", dataState);
		this.cells[cellIndex].firstElementChild.classList.add(pawnClass);
	}

	doOnFlipPawn(pawn) {
		setTimeout(() => {
			const cellIndex = this.reversiEngine.board.getCellIndex(pawn.position.x, pawn.position.y);
			const newState =  (pawn.color === PawnColor.WHITE) ? "white" : "black";
			const cellPawn = this.cells[cellIndex].firstElementChild;
			this.cells[cellIndex].setAttribute("data-state", newState);
			if (cellPawn.classList.contains("flipped")) {
				cellPawn.classList.remove("flipped");
			}
			else {
				cellPawn.classList.add("flipped");
			}
		}, 300);
	}

	doOnNotAvailableMoves() {
		const msg = `<p style="width:100%; text-align: center">Le joueur ${this.reversiEngine.currentPlayer.name} ne peut pas jouer.<br> Il passe son tour.</p>
                 <p style="width:100%; text-align: center;"><i >Cette fenêtre se fermera automatiquement dans 5 secondes</i></p>`;
		this.openModal("Aucune case valide", msg);
	}

	async doOnGameOver(winner) {
		await this.displayGameOverBox(winner);
	}

	doOnStartGame() {
		this.clearGameBoard();
		this.initGameBoard();
		this.updateBoard();
		this.displayScore();
		this.displayPlayerTurn();
	}

	doOnNextTurn() {
		this.updateBoard();
		this.displayScore();
		this.displayPlayerTurn();
	}

	initCounterScore() {
		this.scorePlayerOne = new Counter("#scorePlayerTwo", 2);
		this.scorePlayerTwo = new Counter("#scorePlayerOne", 2);
	}

	hideGameMenuParts() {
		this.toggleMenuRadio.setAttribute("checked", true)
		this.gameMenu_part_intro.classList.remove("show");
	}

	hideGameMenu() {
		this.gameMenucontainer.classList.add("hide");
	}

	showGameBoard() {
		this.gameBoardContainer.classList.add("show");
	}

	async humanvsHumanClickHandler(event) {
		event.preventDefault();

		this.reversiEngine.setPlayer(0,PlayerType.HUMAN, PawnColor.BLACK, "John");
		this.reversiEngine.setPlayer(1,PlayerType.HUMAN, PawnColor.WHITE, "Jane");

		await this.askPlayersName();

		if (this.modalBoxButtonsAction === 0) {
			this.backToMenuClickHandler();
		}
		else {
			this.hideGameMenuParts();
			this.initCounterScore();
			this.newGame();
			this.hideGameMenu();
			this.showGameBoard();
		}

	}

	async humanVsComputerClickHandler() {
		event.preventDefault();

		this.reversiEngine.setPlayer(0,PlayerType.HUMAN, PawnColor.BLACK, "John");
		this.reversiEngine.setPlayer(1,PlayerType.COMPUTER, PawnColor.WHITE, "Ordinateur");

		await this.askSettingsPlayerVsComputer();

		if (this.modalBoxButtonsAction === 0) {
			this.backToMenuClickHandler();
		}
		else {
			this.hideGameMenuParts();
			this.initCounterScore();
			this.newGame();
			this.hideGameMenu();
			this.showGameBoard();
		}
	}

	initEvents() {
		this.btn_play.addEventListener("click", this.playClickHandler.bind(this));
		this.btn_rules.addEventListener("click", this.displayRulesClickHandler.bind(this));
		this.btn_infos.addEventListener("click", this.displayInfosClickHandler.bind(this));
		this.btn_backToMenu.addEventListener("click", this.backToMenuClickHandler.bind(this));

		this.btnStartGameHumanVsHuman.addEventListener("click", this.humanvsHumanClickHandler.bind(this));
		this.btnStartGameHumanVsComputer.addEventListener("click", this.humanVsComputerClickHandler.bind(this));

		this.reversiEngine.addEventListener("onStartGame", this.doOnStartGame.bind(this));
		this.reversiEngine.addEventListener("onNextTurn", this.doOnNextTurn.bind(this));
		this.reversiEngine.addEventListener("onNotAvailableMoves", this.doOnNotAvailableMoves.bind(this));
		this.reversiEngine.addEventListener("onPutPawn", this.doOnPutPawn.bind(this));
		this.reversiEngine.addEventListener("onFlipPawn", this.doOnFlipPawn.bind(this));
		this.reversiEngine.addEventListener("onGameOver", this.doOnGameOver.bind(this));
	}
}