/**-----------------------------------------------------------------------------------------------------------
 * * AbstractdApplication
 *   Classe abstraite à étendre pour réaliser une application 
 *-----------------------------------------------------------------------------------------------------------*/
export default class AbstractApplication {

  /*=======[ PROTECTED VARS ]===============================================================================*/ 
  
  
  /*=======[ CONSTRUCTOR /DESTRUCTOR ]=======================================================================*/
  constructor() {
    // this._apiUrl = quizzApiUrl;
    // if (autoInitLoader) {this._apiLoader = new ApiLoader(quizzApiUrl);}

    if (this.constructor === AbstractApplication) {
      throw new TypeError("La classe abstraite 'AbstractQuizzardApplication' ne peut pas être instanciée directement");
    }
  }

  /*=======[ PROTECTED METHODS ]=============================================================================*/
  /**
   * protected function  _initManager
   * * Initalisisation de l'application  
   */
  _init() {
    throw new Error("Vous devez implémenter cette méthode dans les descendants.");
  }

  /*=======[ PUBLIC METHODS ]================================================================================*/


  /**
   * public function runApplication
   * * Lance l'application et execute la première action
   * @param  {STRING} action : action à executer
   */
  runApplication(action) {
    console.log('AbstractApplication : Run application');   
    this.executeAction(action);  
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