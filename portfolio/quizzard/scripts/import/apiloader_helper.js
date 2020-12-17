/**-----------------------------------------------------------------------------------------------------------
 * * ApiLoader 
 *   Classe utilitaire pour charger une Api web depuis un serveur local ou distant et retournant des données 
 *   sous le format JSON
 *-----------------------------------------------------------------------------------------------------------*/
export default class ApiLoader {

  /*=======[ PROTECTED VARS ]===============================================================================*/  
  _api_url; 

  _local_url;
  _isLocalData = false;
  _localScript;

  /*=======[ CONSTRUCTOR /DESTRUCTOR ]=====================================================================*/
  /**
   * constructor
   * * Initialisation de la classe QuizzardLoader
   * @param  {STRING} urlFileName
   * @param  {BOOL} localData=false (facultatif)
   * @param  {STRING} localFileName="" (facultatif)
   */
  constructor(urlFileName, localData = false, localFileName="") {
    console.log('QuizzardLoader : initialization');
    console.log('Set _api_url = ' + urlFileName);
    this._api_url = urlFileName;      
    console.log('Set _isLocalData = ' + localData);
    this._isLocalData = localData;  
    console.log('Set _LocalUrl = ' + localFileName);
    this._local_url = localFileName;   
  }

  /*=======[ ACCESSORS ]=====================================================================================*/
  /**
   * accesseur get getApi_Url()
   * @return {STRING} url d'acces à l'api sur serveur distant
   */
  get getApi_Url() {
    return this._api_url;    
  }

  /**
   * accesseur get Api_Url()
   * @return {STRING} url d'acces local au fichier js contenant les données JSON sous le nom de "quizzardData"
   */
  get getLocal_Url() {
    return this._local_url;    
  }

  /*=======[ PROTECTED METHODS ]=============================================================================*/
  /**
   * protected function _loadDataFromLocal()
   * * Charge les données depuis le serveur local
   */
 _loadDataFromLocal(callback) {    
    console.log('QuizzardLoader : Loading data from local : ' + this.getLocal_Url);

    const head = document.getElementsByTagName('head')[0];
    this._localScript = document.createElement('script');
    this._localScript.type = 'text/javascript';
    //this._localScript.async = true;

    //document.
    //this._localScript.addEventListener("load", this._loadLocalDatasEvent.bind(this) );

    this._localScript.addEventListener("load", () =>{
      const data = JSON.parse(quizzardData);
      callback(data);
    });

    // document.addEventListener("readystatechange", () => {
    //   console.log("==> Ready State change = " + document.readyState);
    //    if (document.readyState === 'completed') {
    //      this.#loadingComplete = true;
    //    }
    // }); //this._loadLocalDatasEvent.bind(this) );
  
    this._localScript.src= this.getLocal_Url;
    head.appendChild(this._localScript);  
  }

  /**
   * protected function _loadDatasFromServers() 
   * * Charge les données depuis le serveur distant 
   */
   async _loadDatasFromServer(callback) {     
    
      console.log("QuizzardLoader : Loading data from server : " + this.getApi_Url);

      //---- 1ere methode avec fect asyn et await ----------------- (ES8)         

      const response = await fetch(this.getApi_Url);
      const data = await response.json();
      console.log("Loaded datas ==> ");
      console.log(data); 
      callback(data);
      
      //---- 2eme methode avec fetch sans async et await --------------------(ES7)
     
      // fetch(this.getApi_Url).then((response) => {
      //   return response.json();
      // }).then((obj) => {
      //    this._jsonObject = obj;        
      //    console.log(this._jsonObject);
      //   callback(obj);
      // }).catch((error) => {
      //   console.error('Un problème est survenu lors du chargement des données !');
      //   console.error(error);
      // });  

      //---- 3eme methide avec XMLHttpRequest  -------------------- (ES6)
      // console.log("QuizzardLoader : XMLHttpRequest --> get datas from " + this.getApi_Url);

      // const xobj = new XMLHttpRequest();

      // xobj.MimeType = "application/json";
      // xobj.open('GET', this.getApi_Url, true); // Replace 'my_data' with the path to your file
      // xobj.addEventListener("readystatechange", () => {
      //   if (xobj.status == "200") { //xobj.readyState == 4 &&
      //     this._jsonObject = JSON.parse(xobj.responseText); 
      //     console.log(this._jsonObject);
      //   }
      //   else
      //   {
      //     console.error('Un problème est survenu lors du chargement des données !');
      //   }
      // });
      // xobj.send(null);
  }

  /*=======[ PUBLIC METHODS ]================================================================================*/
  /**
   * public function execute() 
   * * Charge les données depuis le serveur local ou distant en fonction des paramètres d'initialisation   
   * * puis execute le callback en lui assant en paramètre un objet JSON
   * @param {FUNC} callback
   */
  execute(callback) {
    if (this._isLocalData) {
      this._loadDataFromLocal(callback);  
    }
    else
    {
      this._loadDatasFromServer(callback);
    }
  }

}