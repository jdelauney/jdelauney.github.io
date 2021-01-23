/** ==========================================================================================================================
 *  Script de gestion et de fonctionnement d'une calculatrice
 *  https://github.com/jdelauney/portfolio
 *  Licensed under MIT Open Source
 *  (R) 01/2021
 *  ==========================================================================================================================*/

const display = document.querySelector("#result");
const historyElt = document.querySelector("#history");

const memClearBtn = document.querySelector("#memClear");
const memPushBtn = document.querySelector("#memPush");
const memPopBtn = document.querySelector("#memPop");


let inputNum = "";
let lastInput = "";
let lastRes = "0";
let lastOp ="";
let currentDisplay ="";
let operateur = null;
let pointUsed = false;
let nbOperator = 0;
let lastInputType ="";
const cr = "<br>";
const history = [];
/**
 * memClear()
 * vide l'espace allouer dans le localStorage pour la sauvegarde d'une valeur de la calculatrice
 */
function memClear() {
  localStorage.removeItem('neumorph_calc');
  memPopBtn.classList.add("btn--disabled");
  memClearBtn.classList.add("btn--disabled");  
}

/**
 * memPush()
 * Assigne la valeur courrante dans le localStorage 
 */
function memPush() {
  localStorage.setItem('neumorph_calc', lastRes);
  memPopBtn.classList.remove("btn--disabled");
  memClearBtn.classList.remove("btn--disabled");
}

/**
 * memPop()
 * Retourne la valeur enregistrée dans le localStorage
 */
function memPop() {
  return localStorage.getItem("neumorph_calc");
}

/**
 * RemoveLastInputChar()
 * Efface le dernier caractère entré par l'utilisateur
 */
function RemoveLastInputChar() {
  if (lastInputType != "equal") {
    switch (lastInputType) {
      case "num":
        if (inputNum.charAt(inputNum.length - 1) == ".") { pointUsed = false; }
        inputNum = inputNum.substring(0, inputNum.length - 1);
        break;
      case "op":
        lastOp = "";
        nbOperator--;
        break;
      default:
        break;
    }
    currentDisplay = currentDisplay.substring(0, currentDisplay.length - 1);
    if (currentDisplay == "") { currentDisplay = "0";}
    updateDisplay();
  }
}

/**
 * updateHistory()
 * Met à jour l'affichage de l'historique
 */
function updateHistory() {
  let disp = "";
  history.forEach((txt) => {
    disp += txt;  
  });
  historyElt.innerHTML = disp;
}

/**
 * clearHistory()
 * Efface l'historique
 */
function clearHistory() {
  history.splice(0, history.length);
  historyElt.innerHTML = "";
}

/**
 * updateDisplay()
 * Met à jour l'affichage en fonction des entrées de l'utilisateur
 */
function updateDisplay() {
  display.value = currentDisplay;
}

/**
 * compute()
 * Retourne le résultat d'un calcul simple entre 2 termes
 */
function compute(op, numA, numB) {
  let result = 0;
  const valueA = parseFloat(numA);
  const valueB = parseFloat(numB);
  
  switch (op) {
    case "mul":
      result = valueA * valueB;
      break;

    case "div":
      if (valueB !== 0) {
        result = valueA / valueB;
      }
      else {
        alert('Vous ne pouvez pas diviser un nombre par zero !');
        result = valueA;
      }      
      break;

    case "sub":
      result = valueA - valueB;
      break;

    case "add":
      result = valueA + valueB;
      break;
 
    default:      
      break;
  }
  operateur = null;
  lastInput = result.toString();
  inputNum = "";
  return lastInput;  
}

/**
 * computeScience()
 * Retourne le resultat d'une fonction mathématique scientifique, comme sin, cos,... 
 * ou de conversion rad <=> deg appliquée sur le paramètre "value"
 *
 * @param {string} op : Type d'opération
 * @param {float} value : valeur à traiter
 *
 * @return {float}
 */
function computeScience(op, value) {
  switch (op) {
    case "sin":
      return Math.sin(value);    
    case "cos":
      return  Math.cos(value);            
    case "rad":
      return  value * (Math.PI / 180);        
    case "deg":
      return  value * (180 / Math.PI);        
    default:
      break;
  }
}

/**
 * computeScience()
 * Retourne le resultat d'une fonction mathématique scientifique, comme sin, cos,... 
 * ou de conversion rad <=> deg en fonction du dernier nombre rentré par l'utilisateur ou du dernier résultat calculé
 *
 * @param {string} op : Type d'opération
 */
function evalScience(op) {

  if (lastInputType == "num") {
    currentDisplay = currentDisplay.substring(0, currentDisplay.length - inputNum.length);
    const v = computeScience(op, parseFloat(inputNum));
    let tmp = op + '(' + inputNum + ')' + cr;
    history.push(tmp);
    inputNum = v.toString();
    tmp = "=" + inputNum + cr;
    pointUsed = false; 
    lastOp = "";
    history.push(tmp);
    currentDisplay += inputNum;    
  }
  else if (lastInputType == "equal") {
    const v = computeScience(op, parseFloat(lastRes));
    let tmp = op + '(' + lastRes + ')' + cr;
    history.push(tmp);
    inputNum = v.toString();
    lastRes = inputNum;
    nbOperator = 0;
    lastOp = "";
    pointUsed = false;               
    tmp = "=" + inputNum + cr;
    history.push(tmp);
    currentDisplay = inputNum;
  }  
  lastInputType = "num";
  updateDisplay();  
  updateHistory(); 
}
/**
 * processKey(evt)
 * Gestionnaire d'évènement des touches cliquées ou appuyées au clavier par l'utilisateur
 */
function processKey(evt) {

  let attr;
  let inputValue;
  
  const numKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const opKeys = ["+", "-", "*", "/", "Enter", "Escape"];

  if (evt.type === "keyup") {
    if (numKeys.includes(evt.key) || (evt.key == '.')) {
      if (evt.key == '.') {
        if (!pointUsed) {
          attr = 'num';
          inputValue =  evt.key;
          pointUsed = true; 
        }
        else {
          attr = "";
          inputValue =  "";
        }
      } 
      else {
        attr = "num";
        inputValue =  evt.key;
      }                
    }
    else if (opKeys.includes(evt.key))
    {
      evt.preventDefault();
      attr='operation';
      inputValue = evt.key;
    }    
  } else {
    attr = this.getAttribute("data-type");
    inputValue =this.textContent;
    if (inputValue == '.') {
      if (!pointUsed) {        
        pointUsed = true; 
      }
      else {
        attr = "";
        inputValue =  "";
      }
    }
  }
  
  switch (attr) {
    case "num":   
      if ((lastInputType == "equal") || ((lastInputType == "func") && ((currentOps == "sin") || (currentOps == "cos") || (currentOps == "rad") || (currentOps == "deg")))) {
        inputNum = "";
        currentDisplay = "";
        lastRes = "0";
        nbOperator = 0;
        lastOp = "";
        pointUsed = false; 
      }
      inputNum = inputNum + inputValue;
      currentDisplay += inputValue;
      updateDisplay();
      lastInputType = "num";
      break;

    case "op":
      currentOps = this.getAttribute("data-op");

      if (currentOps == "equal") { 
        let tmp = lastOp + inputNum + cr;        
        history.push(tmp);
        const res = compute(operateur, lastRes, inputNum);      
        currentDisplay = res;
        tmp = "=" + res + cr;
        history.push(tmp);
        updateDisplay();
        updateHistory();        
        nbOperator = 0;
        lastOp = "";
        lastRes = res;
        inputNum = res;
        lastInputType = "equal";
        memPushBtn.classList.remove("btn--disabled");
        pointUsed = false; 
      }
      else {     
        const opStr = this.textContent;
        currentDisplay += opStr;
        let tmp; 
        ++nbOperator;
        if (nbOperator > 1) {
          tmp = lastOp + inputNum + cr;          
          history.push(tmp);
          lastRes = compute(operateur, lastRes, inputNum); 
          tmp = "=" + lastRes + cr;
          history.push(tmp); 
          lastOp = opStr;   
          pointUsed = false; 
          memPushBtn.classList.remove("btn--disabled");        
        }
        else {
          lastInput = inputNum;
          lastRes = lastInput;
          lastOp = opStr;
          tmp = lastInput + cr;  
          pointUsed = false;        
          history.push(tmp);
          
        }
        
        updateDisplay();
        updateHistory();
        lastInputType = "op";
        operateur = currentOps;        
        inputNum = "";
      }
      
      break;
    
    case "func":
      currentOps = this.getAttribute("data-op");

      switch (currentOps) {
        case "clearLast":
          currentDisplay = currentDisplay.substring(0, currentDisplay.length - inputNum.length);
          inputNum = "";
          if (currentDisplay == "") {
            lastInputType = "";
            currentDisplay = "0";  
            updateDisplay();     
            currentDisplay = "";     
          }
          else {
            lastInputType = "op";
            updateDisplay();
          }                    
          break;

        case "clearAll":
          inputNum = "";
          lastInput = "";
          lastRes = "0";
          lastOp ="";          
          operateur = null;
          pointUsed = false;
          nbOperator = 0;
          lastInputType ="";
          currentDisplay = "0";  
          updateDisplay();     
          currentDisplay = "";  
          memClear();
          clearHistory();
          break;

        case "delLast":
          RemoveLastInputChar();
          break;
        
        case "memClear":
          memClear();
          break;

        case "memPush":
          memPush();
          break;

        case "memPop":
          if ((lastInputType == "op") || (lastRes == "0")) {
            inputNum = memPop();
            currentDisplay += inputNum;
            lastInputType = "num";
            updateDisplay();
          } 
          else if (lastInputType == "equal")  {
            inputNum = memPop();
            lastRes = "0";
            nbOperator = 0;
            lastOp = "";
            pointUsed = false; 
            currentDisplay = inputNum;
            lastInputType = "num";
            updateDisplay();
          }
          break;

        case "pi":
          if ((lastInputType == "op") || (lastRes == "0")) {
            inputNum = Math.PI;
            currentDisplay += inputNum;
            pointUsed = false; 
            lastInputType = "num";
            updateDisplay();
          } 
          else if (lastInputType == "equal")  {
            inputNum = Math.PI;
            lastRes = "0";
            nbOperator = 0;
            lastOp = "";
            pointUsed = false; 
            currentDisplay = inputNum;
            lastInputType = "num";
            updateDisplay();
          }
          break;

        case "sin":
        case "cos":
        case "rad":
        case "deg":
          evalScience(currentOps);
          break;

        default:
          break;
      }
      break;

    default:
      break;
  }

}


/*---[ Point d'entrée de l'application ]---------------------------------------------------------------------------------------------------------*/

/* Assignation des évènements lorsque la page est chargée */
window.onload = () => {

  document.addEventListener('keyup', processKey);

  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", processKey);  
  });
};
