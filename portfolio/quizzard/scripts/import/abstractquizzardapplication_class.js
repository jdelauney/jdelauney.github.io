import ApiLoader from './apiloader_helper.js';
import QuizzardManager from './quizzardmanager_class.js';

/**-----------------------------------------------------------------------------------------------------------
 * * AbstractQuizzardApplication
 *   Classe abstraite à étendre pour réaliser une application de type "quizz"
 *-----------------------------------------------------------------------------------------------------------*/
export default class AbstractQuizzardApplication {

  /*=======[ PROTECTED VARS ]===============================================================================*/ 
  _apiLoader;
  _quizzManager;
  _apiUrl;

  /*=======[ CONSTRUCTOR /DESTRUCTOR ]=======================================================================*/
  constructor(quizzApiUrl, autoInitLoader = true) {
    this._apiUrl = quizzApiUrl;
    if (autoInitLoader) {this._apiLoader = new ApiLoader(quizzApiUrl);}

    if (this.constructor === AbstractQuizzardApplication) {
      throw new TypeError("La classe abstraite 'AbstractQuizzardApplication' ne peut pas être instanciée directement");
    }
  }

  /*=======[ PROTECTED METHODS ]=============================================================================*/
  /**
   * protected function  _initManager
   * * Initalise le gestionnaire de données avec les données au format JSON
   * @param {JSON} jsonData  :  Données au format JSON
   */
  _initManager(jsonData) {
    this._quizzManager = new QuizzardManager(jsonData);
  }

  /*=======[ PUBLIC METHODS ]================================================================================*/
  /**
   * public function getQuizzManager()
   * * Retourne le gestionnaire de données
   * @return {CLASS} classe de type QuizzardManager
   */
  getQuizzManager() {
    return this._quizzManager;
  }

  /**
   * public function runApplication
   * * Lance l'application et execute la première action
   * @param  {STRING} action : action à executer
   */
  runApplication(action) {
    console.log('AbstractQuizzardApplication : Run application');
    this._apiLoader.execute((data) => { 
      this._initManager(data);
      this.executeAction(action);  
    });    
  }

  /**
   * public function executeAction
   * * Gestion centralisée pour le lancement des actions. Cette methode doit être surchargée dans les classes enfant
   * @param  {STRING} action : action à executer
   */
  executeAction(action) {
    throw new Error("Vous devez implémenter cette méthode dans les descendants.");
  }

}