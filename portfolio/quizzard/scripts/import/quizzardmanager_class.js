/**-----------------------------------------------------------------------------------------------------------
 * * QuizzardManager (MODEL)
 *   Classe de gestion dynamique des données d'un quizz
 *   Les données à charger doivent être au format JSON
 *-----------------------------------------------------------------------------------------------------------*/
export default class QuizzardManager {
  
  /*=======[ PROTECTED VARS ]===============================================================================*/      
  _jsonObject;

  _quizzLoaded = false;
  _sectionLoaded = false;

  _currentQuizz;
  _currentQuizzSection;

  /*=======[ CONSTRUCTOR /DESTRUCTOR ]=======================================================================*/
  constructor(jsonDatas) {
    console.log('QuizzardManager : initialization');
    this._jsonObject = jsonDatas; 
    console.log(this._jsonObject);
  }

  /*=======[ PUBLIC METHODS ]================================================================================*/

  /**
   * public function getQuizzCount()
   * * Retourne le nombre total de quizz présent dans les données
   * @return {INT}
   */
  getQuizzCount() {
    return this._jsonObject.quizz.length;
  }

  /**
   * public function getAllQuizzTheme
   * * Retourne dans un tableau les thèmes de tous les quizz
   * @return {ARRAY}
   */
  getAllQuizzTheme() {
    console.log('QuizzardManager : getAllQuizzTheme');
    const themes = [];
    for (let i = 0; (i < this._jsonObject.quizz.length); i++)
    {
      themes.push(this._jsonObject.quizz[i].theme);
    }
    return themes;
  }

  /**
   * public function loadQuizz
   * * Charge et Place le quizz sélectionné dans la variable protége "_currentQuizz"
   * @param  {INT} quizzID : numéro du quizz
   */
  loadQuizz(quizzID) {
    console.log("QuizzardManager : Load quizz");    
    this._currentQuizz = this._jsonObject.quizz[quizzID];    
    this._quizzLoaded = true;
    console.log(this._currentQuizz);
    
  }

  /**
   * public function getQuizz
   * * Retourne le quizz actuellement chargé
   * @return {JSON}  
   */
  getQuizz() {
    console.log("QuizzardManager : Get quizz");
    if (!this._quizzLoaded) { 
      throw new Error("Vous devez d'abord charger un quizz avec la methode : loadQuizz(quizz)"); 
      //return undefined;
    }
    else
    {
     return this._currentQuizz;
    }
  }

  /**
   * public function getQuizzThemeName
   * * Retourne le nom du theme du quizz actuel
   * @return {STRING} 
   */
  getQuizzThemeName() {
    return this._currentQuizz.theme.name;
  }  

  /**
   * public function getQuizzThemeDescription
   * * Retourne la description du theme du quizz actuel
   * @return {STRING} 
   */
  getQuizzThemeDescription() {
    return this._currentQuizz.theme.description;
  }  

  /**
   * public function getSectionCount
   * * Retourne le nombre de section du quizz actuel
   * @return {INT} 
   */
  getSectionCount() {
    return this._currentQuizz.sections.length;
  }
  
  /**
   * public function getTotalQuestionCount
   * * Retourne le nombre total de question présent dans le quizz actuel
   * @return {INT} 
   */
  getTotalQuestionCount() {
    let nbQuestions = 0;
    for (let i = 0; (i < this._currentQuizz.sections.length); i++) {
      for (let j = 0; (j < this._currentQuizz.sections[i].questions.length); j++) {
        nbQuestions++;
      }
    }
    return nbQuestions;
  }   

  /**
   * public function loadSection
   * * Définis le quizz sélectionné dans la variable protégée "_currentQuizzSection"
   * @param  {INT} section : numéro de la section du quizz
   */
  loadSection(section) {
    console.log("QuizzardManager : Load quizz section : " + section);
    this._currentQuizzSection = this._currentQuizz.sections[section];
    this._sectionLoaded = true;
    console.log(this._currentQuizzSection);        
  } 

  /**
   * public function getSection
   * * Retourne la section actuellement chargée.
   * @return {JSON} 
   */
  getSection() {
    console.log("QuizzardManager : Get quizz section");
    if (!this._sectionLoaded) { 
      throw new Error("Vous devez d'abord charger une section avec la méthode : loadSection(section)"); 
      //return undefined;
    }
    else
    {
     return this._currentQuizzSection; 
    }
  } 

  /**
   * public function getCorrectAnswer
   * * Retourne la réponse correcte se trouvant à la position "questionIdx" dans la section "sectionIdx"
   * @param {INT} sectionIdx   : Numéro d'index de la section dans le quizz
   * @param {INT} questionIdx  : Numéro d'index de la question dans la section
   * @return {INT} 
   */
  getCorrectAnswer(sectionIdx, questionIdx) {
    this.loadSection(sectionIdx);
    const question = this.getQuestionItem(questionIdx);
    return question.correctAnswer;
  }

  /**
   * public function getSectionQuestionCount
   * * Retourne le nombre de question dans section courrante
   * @return {INT} 
   */
  getSectionQuestionCount() {
    return this._currentQuizzSection.questions.length;
  }

  /**
   * public function getQuestions
   * * Retourne les questions de la section courrante
   * @return {JSON} 
   */
  getQuestions() {
    return this._currentQuizzSection.questions;
  }

  /**
   * public function getQuestionItem
   * * Retourne la question à la position "questionIdx" de la section courrante
   * @param {INT} questionIdx  : Numéro d'index de la question dans la section
   * @return {JSON} 
   */
  getQuestionItem(questionIdx) {
    return this._currentQuizzSection.questions[questionIdx];
  }
}