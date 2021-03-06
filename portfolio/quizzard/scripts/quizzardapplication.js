/* LE NOM DES FICHIERS A IMPORTER DOIVENT DEBUTER PAR LES CARACTERES "./" INDIQUANT LE CHEMIN RELATIF */
import AbstractQuizzardApplication from './import/abstractquizzardapplication_class.js';

import {hljs} from './import/hljs/highlight.pack.js';

/**-----------------------------------------------------------------------------------------------------------
 * * QuizzardApplication
 *   Classe pour réaliser une application de type "quizz" à partir des fichiers html/css présents
 *-----------------------------------------------------------------------------------------------------------*/
export default class QuizzardApplication extends AbstractQuizzardApplication {

  /*=======[ PROTECTED VARS ]===============================================================================*/ 
  /** 
    * * Enumération des actions qu'il est possible d'executer par l'application  
    */
  _actions = {
    INIT      : "init",
    GOTO_HOME : "goto_home",
    QUIZZ : {
      STARTQUIZZ            : "start_quizz",
      GOTO_FIRST_SECTION    : "goto_first_section",
      GOTO_NEXT_SECTION     : "goto_next_section",
      GOTO_PREV_SECTION     : "goto_prev_section",      
      SHOW_SCORE            : "show_score",
      SHOW_CORRECTION       : "show_correction",
      RETRY                 : "retry_quizz"      
    }
  };

  _currentPage = 0;
  _pageCount = 0;
  _currentSection = 0;
  _score = 0;
  
  _questionPerPage = 5; //Nombre de question affichées par page
  
  /*=======[ CONSTRUCTOR /DESTRUCTOR ]=======================================================================*/  
  constructor() {
    //super(quizzApiUrl, autoInitLoader);
    console.log('QuizzardApplication : Initialisation');
    // changez ici le nom du fichier et son mode (local=false ou serveur=true)
    super('api/quizzard.json', true);
  }

  /*=======[ ACCESSORS ]=====================================================================================*/
  /**
   * published property actions
   * * Retourne les actions possibles de l'application
   * @return {OBJ} 
   */
  get actions() {
    return this._actions;
  }

  /**
   * published property actions
   * * Retourne le nombre de question par page
   * @return {INT} 
   */
  get questionsPerPage() {
    return this._questionPerPage;
  }

  /**
   * published property actions
   * * Modifie le nombre de question par page
   * @return {INT} 
   */
  set questionsPerPage(aValue) {
    this._questionPerPage = aValue;
  }

  /*=======[ PROTECTED METHODS ]=============================================================================*/
  /**
   * protected function _changeMainTitle
   * * Modifie le titre dans la vue de la partie section
   */
  _changeMainTitle() {
    console.log("QuizzardApplication : _changeMainTitle()" + this._pageCount);
    const quizzBox = document.querySelector("#quizzBox");
    const mainTitle = quizzBox.querySelector("h1");

    //mainTitle.innerHTML = `${this._quizzManager.getQuizzThemeName()}<br>Section ${(this._currentPage + 1)}/${this._pageCount}`; 
    mainTitle.innerHTML = `${this._quizzManager.getSectionName()}<br>${this._quizzManager.getSectionDescription()}<br>Section ${(this._currentPage + 1)}/${this._pageCount}`; 
  }

  /**
   * protected function _displayPage
   * * Affiche la section du quizz choisie avec "pageIdx"
   * @param {INT} pageIdx : Numéro d'index de la section
   */
  _displayPage(pageIdx) {
    console.log("QuizzardApplication : _displayPage("+ pageIdx + ")");
    this._changeMainTitle();

    const btnPrev = document.querySelector('.ctrl-prev');
    const btnNext = document.querySelector('.ctrl-next');

    if (pageIdx > 0) {
      btnPrev.style = "display:block;";
    }
    else {
      btnPrev.style = "display:none;";
    }

    const btnEval = document.querySelector(".ctrl-eval");

    if (pageIdx == (this._pageCount - 1)) {      
      btnNext.style = "display:none;";      
      btnEval.style = "display:block";                
    }
    else {
      btnNext.style = "display:block;";
      btnEval.style = "display:none";
    }

    const sections = document.querySelectorAll(".quizzSection-container");
    const currentSection = sections[pageIdx];
    sections.forEach((elt) => {
      elt.setAttribute("data-show", false);
    });

    currentSection.setAttribute("data-show", "true");  
    window.scrollTo(0, 0);
  }

  /**
   * protected function _event_onClick_GotoHome
   * * Evenement éxècuter lors du click sur un bouton pour retourner à l'ecran d'accueil 
   */
  _event_onClick_GotoHome() {
    this.executeAction(this._actions.GOTO_HOME);
  }

  /**
   * protected function _event_onClick_EvaluateQuizz
   * * Evenement éxècuter lors du click sur un bouton pour évaluer le quizz
   */
  _event_onClick_EvaluateQuizz() {
    this.executeAction(this._actions.QUIZZ.SHOW_SCORE);
  }

  /**
   * protected function _generateQuizz
   * * Procedure de génération de la vue du questionnaire en fonction du quizz choisi
   */
  _generateQuizz() {
    console.log('QuizzardApplication : _generateQuizz()');
    const questionCount = this._quizzManager.getSectionQuestionCount();


    console.log('Nombre de question de la section : ' + questionCount);
    console.log('QuestionPerPage : ' + this.questionsPerPage);
    let nbSection = Math.floor(questionCount / this.questionsPerPage);
    console.log('nbSection : ' + nbSection);
    

    const numSection = ((questionCount % this.questionsPerPage) === 0 ) ? nbSection : (nbSection + 1);
    

    console.log('Nombre de page : ' + numSection);

    this._pageCount = numSection; //this._quizzManager.getSectionCount();
    this._currentPage = 0;
    

    this._changeMainTitle();
    
    const quizzBoxForm = document.querySelector("#quizzBox-form");

    quizzBoxForm.setAttribute("data-section-count", this._pageCount.toString());
    quizzBoxForm.setAttribute("data-section-current", this._currentPage.toString());

    //const quizzSlider = document.querySelector("quizzSlider-container");

    const quizzSections = document.querySelector("#quizzSections");
    quizzSections.textContent = "";


    this._quizzManager.shuffleQuestions();
    let startIdx = 0;
    
    //for (let i = 0; (i < this._quizzManager.getSectionCount()); i++) { 
    for (let i = 0; (i < numSection); i++) { 
      //console.log('---> Nouvelle section :' + i);   
      //this._quizzManager.loadSection(i);
      
      const newSection = document.createElement("li");
      newSection.classList.add("quizzSection-container");
      if (i > 0) {
        newSection.setAttribute("data-show", "false");
      }
      else {
        newSection.setAttribute("data-show", "true");
      }

      const newQuestionList = document.createElement("ol");
      newQuestionList.classList.add("quizzSection-question-list");

      let endIdx = (startIdx + this.questionsPerPage);
      if (endIdx > questionCount ) { endIdx = questionCount; }

      console.log("startIdx = " + startIdx + " endIdx = " + endIdx);
      
      //for (let j = 0; (j < this._quizzManager.getSectionQuestionCount()); j++) {
      for (let j = startIdx; (j < endIdx); j++) {
         //console.log('------> Nouvelle question :' + j); 
        // @TODO function _createQuestionCard
        const newQuestion = document.createElement("li");
        newQuestion.classList.add("quizzSection-question-box");
        const questionData = this._quizzManager.getQuestionItem(j);
        // En-tête de la question  
        const questionHeader = document.createElement("div");
        questionHeader.classList.add("quizzSection-question-header");
        const questionHeader_Title = document.createElement('h4');
        questionHeader_Title.textContent = questionData.question;
        questionHeader.appendChild(questionHeader_Title);

        const questionHeader_Details = document.createElement("div");        
        questionHeader_Details.classList.add("quizzSection-question-details");
        const questionHeader_Details_Content = document.createElement("p"); 
        questionHeader_Details_Content.textContent = questionData.details.text;
        questionHeader_Details.appendChild(questionHeader_Details_Content);

        if (questionData.details.extra != "") {
          const questionHeader_Details_Extra_Pre = document.createElement("pre"); 
          
          const questionHeader_Details_Extra_Code = document.createElement("code"); 
          questionHeader_Details_Extra_Code.classList.add("javascript");
          questionHeader_Details_Extra_Code.textContent = questionData.details.extra;
          questionHeader_Details_Extra_Pre.appendChild(questionHeader_Details_Extra_Code);
          questionHeader_Details.appendChild(questionHeader_Details_Extra_Pre);
        }

        questionHeader.appendChild(questionHeader_Details);
        newQuestion.appendChild(questionHeader);
                
        let choices = document.createElement("ol");
        let correctAnswer = questionData.correctAnswer;
        choices.classList.add("quizzSection-question-choices");
        for (let k = 0; (k < questionData.choices.length ); k++) {
          // @TODO : function _createChoice
          let choice = document.createElement("li");
          let choiceInput = document.createElement("input");
          let choiceLabel = document.createElement("label");  
                          
          let choiceName = `choice-group-${i}-${j}`;
          let choiceID = `choice-${i}-${j}-${k}`;
          choiceInput.setAttribute('type', 'radio');
          choiceInput.setAttribute('name', choiceName);
          choiceInput.setAttribute('id', choiceID);
          //choiceInput.setAttribute('value', k);

          // if (k == correctAnswer) {
          //   choiceInput.setAttribute('value', "1");
          // }
          // else
          // {
          //   choiceInput.setAttribute('value', "0");
          // }

          choice.appendChild(choiceInput);

          choiceLabel.setAttribute("for", choiceID);
          choiceLabel.innerHTML = questionData.choices[k];

          choice.appendChild(choiceLabel);

          //----------------------------------------------
          if (k == correctAnswer) {
            let aside = document.createElement("aside");
            aside.classList.add("choice-answer");
            let answerText = document.createElement("p");
            answerText.textContent = questionData.infos.text;
            aside.appendChild(answerText);

            if (questionData.infos.ref != "") {
              let answerRef;

              if (questionData.infos.refUrl != "") {
                answerRef = document.createElement("a");
                answerRef.setAttribute("href", questionData.infos.refUrl);
                answerRef.setAttribute("target", "_blank");
                answerRef.textContent = questionData.infos.ref;            
              }
              else
              {
                answerRef = document.createElement("span");
                answerRef.textContent = questionData.infos.ref;                            
              }
              aside.appendChild(answerRef);
            }
            choice.appendChild(aside);

          }

          choices.appendChild(choice);
        }
        
        //----------------------------------------------
        newQuestion.appendChild(choices);
        newQuestionList.appendChild(newQuestion);       
      }
    
      newSection.appendChild(newQuestionList);
      quizzSections.appendChild(newSection);

      // Surlignage du code avec la bibliothèque highlight.js      
      const hlBlock = document.querySelectorAll('pre code');      
      hlBlock.forEach((block) => {
        //console.log(block);
        hljs.highlightBlock(block);
      });

      const btnEval = document.querySelector(".ctrl-eval");
      if (this._pageCount == 1) {              
        const btnNext = document.querySelector('.ctrl-next');
        btnNext.style = "display:none";        
        btnEval.style = "display:block";
      }
      btnEval.removeEventListener("click", this._event_onClick_GotoHome);
      btnEval.addEventListener("click", this._event_onClick_EvaluateQuizz.bind(this));  
      startIdx = startIdx + this.questionsPerPage;
    }

    //quizzBoxForm.appendChild(quizzSections);
    
  }

  /**
   * protected function _evalQuizz()
   * * Evaluation du quizz et préparation de la vue, pour consulter la correction
   */
  _evalQuizz() {
    console.log("QuizzardApplication : _evalQuizz()");
    this._score = 0;
    const pages = document.querySelectorAll(".quizzSection-container"); 
    let questionIdx = 0;
    console.log("Nombre de page : " + pages.length);
    for (let pageIdx = 0; (pageIdx < pages.length); pageIdx++) {
      const page = pages[pageIdx];      
      const questions = page.querySelectorAll(".quizzSection-question-list > li"); 
      
      for (let i = 0; (i < questions.length); i++) {
        const question = questions[i];        
        const choices = question.querySelectorAll(".quizzSection-question-choices > li");        

        const correctAnswer = this._quizzManager.getCorrectAnswer(this._currentSection, questionIdx);
        console.log('La reponse correcte est : ' + correctAnswer);

        for (let choiceIdx = 0; (choiceIdx < choices.length); choiceIdx++) {
          const choice = choices[choiceIdx];
          
          const inputRadio = choice.querySelector("input");
          if (inputRadio.checked) {
            console.log('La réponse cochée est : ' + choiceIdx);
            if (choiceIdx != correctAnswer) {
              inputRadio.setAttribute("data-value", "wrong");
            }
            else {              
              this._score++;
              inputRadio.setAttribute("data-value", "good");
              console.log("SCORE : " + this._score.toString());
            }            
          }
          
          if (choiceIdx == correctAnswer) {
            const answer = choice.querySelector(".choice-answer");
            answer.style = "display:block";                        
          }
        }
        questionIdx++;
      }
    }    
  }

  _fillSectionThemes(quizzIdx) {
    console.log('QuizzardApplication : _fillSectionThemes(' + quizzIdx + ')');
    this._quizzManager.loadQuizz(quizzIdx);
    const sections = this._quizzManager.getAllSections();

    const selectSectionElement = document.querySelector("#selectSection"); 

    for( let i = 0; (i < sections.length); i++) {
      console.log(sections[i]);
      let opt = document.createElement("option");
      opt.value= i;
      opt.textContent = sections[i].name; // whatever property it has            
      selectSectionElement.appendChild(opt);            
    }

    const sectionDescription = document.querySelector("#sectionDescription"); 
    sectionDescription.textContent = sections[0].description;    
  }

  /*=======[ PUBLIC METHODS ]================================================================================*/
  /**
   * public function actionInitQuizz
   * * Methode d'initialisation du quizz. A APPELER EN PREMIER
   */
  actionInitQuizz() {
    console.log("QuizzardApplication : actionInitQuizz()");    
    console.log("Quizzard contient " + this._quizzManager.getQuizzCount() + " questionnaire(s)");

    const selectThemeElement = document.querySelector("#selectTheme"); 
    const themes = this._quizzManager.getAllQuizzTheme();
              
    for( let i = 0; (i < themes.length); i++) {
      console.log(themes[i]);
      let opt = document.createElement("option");
      opt.value= i;
      opt.textContent = themes[i].name; // whatever property it has            
      selectThemeElement.appendChild(opt);            
    }
    const themeDescription = document.querySelector("#themeDescription"); 
    themeDescription.textContent = themes[0].description; 
    this._fillSectionThemes(0); 
    this._quizzManager.loadSection(0);

    /* Initialisation des évènements */
    selectThemeElement.addEventListener("change", () => {
      const themeElement = document.querySelector("#selectTheme"); 
      let selectedQuizzIndex = themeElement.value;
      this._quizzManager.loadQuizz(selectedQuizzIndex);  
      const themeDescription = document.querySelector("#themeDescription");  
      themeDescription.textContent = this._quizzManager.getQuizzThemeDescription();
      this._fillSectionThemes(selectedQuizzIndex);
    });

    const selectSectionElement = document.querySelector("#selectSection"); 
    selectSectionElement.addEventListener("change", () => {  
      const sectionElement = document.querySelector("#selectSection");                  
      this._currentSection = sectionElement.value;            
      const sectionDescription = document.querySelector("#sectionDescription");  
      this._quizzManager.loadSection(this._currentSection);
      sectionDescription.textContent = this._quizzManager.getSectionDescription();        
    });

    const btnStartQuizz = document.querySelector("#btnStartQuizz"); 
    btnStartQuizz.addEventListener("click", () =>{ this.executeAction(this._actions.QUIZZ.STARTQUIZZ);});  

    const btnPrev = document.querySelector('.ctrl-prev');
    const btnNext = document.querySelector('.ctrl-next');

    btnPrev.addEventListener('click', () => { this.executeAction(this._actions.QUIZZ.GOTO_PREV_SECTION);});
    btnNext.addEventListener('click', () => { this.executeAction(this._actions.QUIZZ.GOTO_NEXT_SECTION);});  
    
  }

  /**
   * public function actionInitQuizz
   * * Methode pour débuter le quizz
   */
  actionStartQuizz()  {
    console.log("QuizzardApplication : actionStartQuizz()");
    const selectThemeElement = document.querySelector("#selectTheme"); 
    // let selectedQuizzIndex = selectThemeElement.value;
    // this._quizzManager.loadQuizz(selectedQuizzIndex);

    console.log("Questionnaire sur le theme : " + this._quizzManager.getQuizzThemeName() + " chargé.");
    console.log("Ce questionnaire contient " + this._quizzManager.getSectionCount() + " sections.");  
    console.log("Ce questionnaire contient au total " + this._quizzManager.getTotalQuestionCount() + " questions."); 

    const introBox = document.querySelector("#introBox");
    introBox.setAttribute("data-show", "false");
    const quizzBox = document.querySelector("#quizzBox");
    quizzBox.setAttribute("data-show","true"); 

    this._generateQuizz();
  }

  /**
   * public function actionGotoHome
   * * Retour à la page d'accueil
   */
  actionGotoHome() {
    console.log("QuizzardApplication : actionGotoHome()");
    const evalBox = document.querySelector("#evalBox");
    evalBox.setAttribute("data-show","false");     
    const introBox = document.querySelector("#introBox");
    introBox.setAttribute("data-show", "true"); 
    const btnEval = document.querySelector(".ctrl-eval");
    btnEval.textContent = "Evaluation";
    btnEval.removeEventListener("click",this._event_onClick_GotoHome);
    btnEval.addEventListener("click", this._event_onClick_EvaluateQuizz.bind(this));   
    window.scrollTo(0, 0); 
  }

  /**
   * public function actionGotoNextSection
   * * Passer à la section suivante
   */
  actionGotoNextSection() {
    console.log("QuizzardApplication : actionGotoNextSection()");
    if (this._currentPage < (this._pageCount)) {
      this._currentPage++;
    
      this._displayPage(this._currentPage);      
    }
  }

  /**
   * public function actionGotoPrevSection
   * * Passer à la section précédente
   */
  actionGotoPrevSection() {
    console.log("QuizzardApplication : actionGotoPrevSection()");
    if (this._currentPage > 0) {
      this._currentPage--;      
      this._displayPage(this._currentPage);      
    }  
  }

  /**
   * public function actionDisplayScore
   * * Evalue et affiche la page d'evaluation du quizz
   */
  actionDisplayScore() {  
    console.log("QuizzardApplication : actionDisplayScore()");
    this._evalQuizz();

    const quizzBox = document.querySelector("#quizzBox");
    quizzBox.setAttribute("data-show","false"); 
    const evalBox = document.querySelector("#evalBox");
    evalBox.setAttribute("data-show","true"); 

    const score = document.querySelector(".eval-result");
    score.textContent = this._score.toString() + '/' + this._quizzManager.getSectionQuestionCount().toString();

    const btnShowCorrection = document.querySelector("#btnShowCorrection");
    btnShowCorrection.addEventListener("click", () => { this.executeAction(this._actions.QUIZZ.SHOW_CORRECTION);});

    const btnRetry = document.querySelector("#btnRetry");
    btnRetry.addEventListener("click", () => { this.executeAction(this._actions.QUIZZ.RETRY);});

    const btnGoHome = document.querySelector("#btnGoHome");
    btnGoHome.addEventListener("click", () => { this.executeAction(this._actions.GOTO_HOME);}); 
    window.scrollTo(0, 0);
  }

  /**
   * public function actionDisplayCorrection
   * * Affiche le quizz corrigé
   */
  actionDisplayCorrection() {
    console.log("QuizzardApplication : actionDisplayCorrection()");    
    this._currentPage = 0;
    this._displayPage(0);  
    const quizzBox = document.querySelector("#quizzBox");
    quizzBox.setAttribute("data-show","true"); 
    const evalBox = document.querySelector("#evalBox");
    evalBox.setAttribute("data-show","false");  
    const btnEval = document.querySelector(".ctrl-eval");
    btnEval.textContent = "Accueil";
    btnEval.removeEventListener("click", this._event_onClick_EvaluateQuizz);
    btnEval.addEventListener("click", this._event_onClick_GotoHome.bind(this));   
  }

  /**
   * public function actionRetryQuizz
   * * Recommence le quizz
   */
  actionRetryQuizz() {
    console.log("QuizzardApplication : actionRetryQuizz()"); 
    this._generateQuizz();
    this._currentPage = 0;
    this._displayPage(0);
    const quizzBox = document.querySelector("#quizzBox");
    quizzBox.setAttribute("data-show","true"); 
    const evalBox = document.querySelector("#evalBox");
    evalBox.setAttribute("data-show","false");     
    
  }

 /**
   * public function executeAction
   * * Gestion centralisée pour le lancement des actions. 
   * * Méthode surchargée de la classe parente
   * @param  {STRING} action : action à executer
   */
  executeAction(action) {
    console.log('QuizzardApplication : Request action ' + action);
    
    switch(action) {
      case this._actions.INIT :
        console.log('QuizzardApplication : Execute action ' + this._actions.INIT);
        this.actionInitQuizz();
        break;
      
      case this._actions.QUIZZ.STARTQUIZZ :
        console.log('QuizzardApplication : Execute action ' + this._actions.QUIZZ.STARTQUIZZ);
        this.actionStartQuizz();
        break;

      case this._actions.GOTO_HOME :
        console.log('QuizzardApplication : Execute action ' + this._actions.GOTO_HOME);
        this.actionGotoHome();
        break;

      case this._actions.QUIZZ.GOTO_PREV_SECTION :
        console.log('QuizzardApplication : Execute action ' + this._actions.QUIZZ.GOTO_PREV_SECTION);
        this.actionGotoPrevSection();
        break;
      
      case this._actions.QUIZZ.GOTO_NEXT_SECTION :
        console.log('QuizzardApplication : Execute action ' + this._actions.QUIZZ.GOTO_NEXT_SECTION);
        this.actionGotoNextSection();
        break;

      case this._actions.QUIZZ.SHOW_SCORE : 
        console.log('QuizzardApplication : Execute action ' + this._actions.QUIZZ.SHOW_SCORE);
        this.actionDisplayScore();
        break;

      case this._actions.QUIZZ.SHOW_CORRECTION : 
        console.log('QuizzardApplication : Execute action ' + this._actions.QUIZZ.SHOW_CORRECTION);
        this.actionDisplayCorrection();
        break;

      case this._actions.QUIZZ.RETRY :
        console.log('QuizzardApplication : Execute action ' + this._actions.QUIZZ.RETRY);
        this.actionRetryQuizz();
        break;

      default:         
    }
  }
}

