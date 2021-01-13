import AbstractApplication from "./import/abstractApplication_class.js";

const c2PI = Math.PI * 2;
const c180DivPI = 180 / Math.PI;

function radianToDeg(radians) {  
  return radians * c180DivPI;
}

export default class TimeZoneApplication extends AbstractApplication {
  
  _actions = {
    INIT         : "init",
    ADD_CLOCK    : "addClock",    
    REMOVE_CLOCK : "removeClock"  
  };

  _api_url_location = "http://worldtimeapi.org/api/timezone"; 

  _locations            = {};
  _currentZone          ="";
  _currentState         ="";
  _currentCity          = 0;
  _maxWorldClock        = 4;
  _activeWorldClock     = [];
  _activeWorldClockCount = 0;

  constructor() {
    //super(quizzApiUrl, autoInitLoader);
    console.log('timeZoneApplication : Initialisation');
    super();
    // changez ici le nom du fichier et son mode (local=false ou serveur=true)    
  }


  _fillZone() {
    console.log("TimeZoneApplication : _fill_zone()");
    const selectZone = document.querySelector("#selectZone"); 
    let idx = 0;
    for (const zone in this._locations) {        
      let opt = document.createElement("option");
      opt.value= zone;
      if (idx == 0) { 
        opt.selected = true; 
        idx++;
        this._currentZone = zone;
      }
      opt.textContent = `${zone}`; // whatever property it has            
      selectZone.appendChild(opt);            
    }
  }

  _fillStates() {
    console.log("TimeZoneApplication : _fill_state()");
    const selectState = document.querySelector("#selectState"); 
    
    for(let i = (selectState.options.length - 1); i >= 0; i--) {
       selectState.remove(i);
    }    
    
    let idx = 0;
    for (const state in this._locations[this._currentZone]) {        
      let opt = document.createElement("option");
      opt.value= state;
      if (idx == 0) { 
        opt.selected = true; 
        idx++;
        this._currentState = state;
      }
      opt.textContent = `${state}`;
      selectState.appendChild(opt);            
    }
  }  

  _fillCities() {
    console.log("TimeZoneApplication : _fill_cities()");
    const selectCity = document.querySelector("#selectCity"); 

    for(let i = (selectCity.options.length - 1); i >= 0; i--) {
       selectCity.remove(i);
    } 

    const cityCount = this._locations[this._currentZone][this._currentState].length;
    for (let i=0; (i < cityCount); i++) {  
      let city = this._locations[this._currentZone][this._currentState][i];     
      let opt = document.createElement("option");
      if (i == 0) { opt.selected = true;}
      opt.value= i;
      opt.textContent = `${city}`; 
      selectCity.appendChild(opt);            
    }
  }  

  async _getLocationDatas() {  
    console.log("TimeZoneApplication : _getLocationDatas()");
    const url = this._api_url_location;
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An error has occured: ${response.status} = ${response.statusText}`;
      throw new Error(message);
    }
    let datas = await response.json();   
    return datas; 
  }  

  async _getLocationTimestamp(index) {  
    console.log("TimeZoneApplication : _getLocationDatas()");    
    const url = this._api_url_location + '/' + this._activeWorldClock[(index-1)];    
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An error has occured: ${response.status} = ${response.statusText}`;
      throw new Error(message);
    }
    let datas = await response.json();       
    return datas.datetime; 
  }  

  _loadLocations() {
    console.log("TimeZoneApplication : _init()");
    let state = "";
    let city = "";
    let timeZone ="";
    const excludes = ["CET","CST6CDT", "EET", "EST", "Etc","HST", "MET", "MST", "MST7MDT", "PST8PDT", "WET"]; 
    const loader = document.querySelector("#loader");

    this._getLocationDatas().then(datas => {
      let dataCount = datas.length;
      // console.log(dataCount);
      // console.log(datas);    
      for (let i=0; (i < dataCount); i++) {    
        let fullZone = datas[i];      
        let parts = fullZone.split('/');      
        let zoneCount = parts.length;      
        if (zoneCount >1 ) {
          if ( !excludes.includes(parts[0])) {
            switch (zoneCount) {  
              case 2:
                timeZone = parts[0];
                state = "-";
                city = parts[1];
                break;
              case 3:
                timeZone = parts[0];
                state =  parts[1];
                city = parts[2];
                break;
              default:
                break;
            }

            if ((this._locations[timeZone] == undefined)) {
              this._locations[timeZone] = {};
              this._locations[timeZone][state] =  [];
            }
            
            if (this._locations[timeZone].hasOwnProperty(state)) {
              this._locations[timeZone][state].push(city);          
            }
            else
            {          
              this._locations[timeZone][state] = [];
              this._locations[timeZone][state].push(city);
            }                  
          }
        }
      }
      //console.log(this._locations);    
      this._fillZone();   
      this._fillStates(); 
      this._fillCities();
      loader.classList.toggle("loader--hidden");

    }).catch(error =>{
      console.log(error);
    });      
  }

  _removeWorldCLock(index) {   
    console.log("TimeZoneApplication : _removeWorldCLock");
    const clock = document.querySelector(`#worldClock-${index}`);        
    clock.remove();
    this._activeWorldClockCount--;   
    this._activeWorldClock.splice((index-1),1);
    if (this._activeWorldClockCount == 0) {      
      clearInterval(this._updateWorldClocks());      
    }
  }

  _addWorldClock() {
    console.log("TimeZoneApplication : _addWorldClock");
    
    if (this._activeWorldClockCount < this._maxWorldClock) {      
      const index = ++this._activeWorldClockCount;
      const zone = this._currentZone;      
      const state = (this._currentState == '-') ? "" : this._currentState+"/";
      const city = this._locations[this._currentZone][this._currentState][this._currentCity];
      const loc = zone + "/" + state + city;

      this._activeWorldClock.push(loc);

      const element = `        
          <div class="wordClock__grid__card_container">
            <div class="card__clock">
              <div class="card__clock__header">
                <h3>${loc}</h3>
                <button id="btnRemove-${index}" data-index="${index}" class="card__clock__btn btn-delete">&times;</button>
              </div>
              <div class="card__clock__wrapper">
                <div class="card__clock__timer">
                  <p class="card__clock__hours">12</p>
                  <div class="card__clock__label">Heure</div>
                </div>
                <div class="card__clock__timer">
                  <p class="card__clock__minutes">00</p>
                  <div class="card__clock__label">Minutes</div>
                </div>
                <!-- <div class="card__clock__timer">
                  <p class="card__clock__seconds">00</p>
                  <div class="card__clock__label">Secondes</div>
                </div> -->
              </div>
            </div>
          </div>          
      `;

      const worldClocks = document.querySelector("#worldClocks");

      //worldClocks.innerHTML += element; /* LE INNERHTML DETRUIT LES EVENEMENTS POUR EVITER CA IL FAUT PASSER PAR UNE FONCTION DU DOM ET DONC CREER UN ELEMENT DE BASE */

      const card = document.createElement('div');
      card.id = `worldClock-${index}`;
      card.classList.add("wordClock__grid__card");
      card.innerHTML = element;

      worldClocks.appendChild(card);

      const btnRemove = document.querySelector(`#btnRemove-${index}`);
      btnRemove.addEventListener("click", ()=> {
         this._removeWorldCLock(index);
      });      

      if (this._activeWorldClockCount == 1) {
        this._updateDisplayWorldClock(index);
        this. _startWatchingWorldClocks();
      }
      else {
        this._updateDisplayWorldClock(index);      
      }
    }  

    const modal = document.querySelector("#modal");
    const modalOverlay = document.querySelector("#modal-overlay");
    modal.classList.toggle("modal-box--hidden");
    modalOverlay.classList.toggle("modal-box--hidden");
  }
  
  _updateMainClock() {
    const now = new Date();
    const hours = (now.getHours() > 12) ? (now.getHours() - 12) : now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const hourDeg   = radianToDeg(c2PI * (hours / 12));
    const minuteDeg = radianToDeg(c2PI * (minutes / 60));
    const secondDeg = radianToDeg(c2PI * (seconds / 60));
    
    
    document.querySelector(".user__timezone__clock__hours").style.transform = `rotate(${hourDeg}deg)`;
    document.querySelector(".user__timezone__clock__minutes").style.transform = `rotate(${minuteDeg}deg)`;
    document.querySelector(".user__timezone__clock__seconds").style.transform = `rotate(${secondDeg}deg)`;  
  }

  _updateDisplayWorldClock(index) {
    this._getLocationTimestamp(index).then(unixTimestamp => {
      //console.log(`timestamp ==> ${unixTimestamp}`);
      
      //const dateObj = new Date(); 
      const dateObj = unixTimestamp.match(/\d+/g);
      //dateObj.parse(unixTimestamp); //(unixTimestamp * 1000); 
      const h = dateObj[3]; //.getHours(); 
      const m = dateObj[4]; //.getMinutes();

      const clock = document.querySelector(`#worldClock-${index}`);      
      const hours = clock.querySelector('.card__clock__hours');
      const minutes = clock.querySelector('.card__clock__minutes');
      hours.textContent = h; //.toString().padStart(2, '0');//zeroPadding(h, 2);
      minutes.textContent = m; //.toString().padStart(2, '0');//zeroPadding(m, 2);

    }).catch(error =>{
      console.log(error);
    });   
  }

  _updateWorldClocks() {
    console.log("TimeZoneApplication : _updateWorldClocks()"); 
    for (let i=0; (i < this._activeWorldClock.length); i++) {
      this._updateDisplayWorldClock(i);
    }
  }

  _initEvents() {
    console.log("TimeZoneApplication : _initEvents()");      
    const btnAddClock = document.querySelector("#btn-add-clock");
    btnAddClock.addEventListener("click", () => {
      if (this._activeWorldClockCount < this._maxWorldClock) { 
        const modal = document.querySelector("#modal");
        const modalOverlay = document.querySelector("#modal-overlay");
        modal.classList.toggle("modal-box--hidden");
        modalOverlay.classList.toggle("modal-box--hidden");
      }
    });

    const btnCloseModal = document.querySelector("#btn-close-modal");
    btnCloseModal.addEventListener("click", function() {
      const modal = document.querySelector("#modal");
      const modalOverlay = document.querySelector("#modal-overlay");
      modal.classList.toggle("modal-box--hidden");
      modalOverlay.classList.toggle("modal-box--hidden");
    });


    const mdlOverlay = document.querySelector("#modal-overlay");
    mdlOverlay.addEventListener("click", function() {
      const modal = document.querySelector("#modal");
      const modalOverlay = document.querySelector("#modal-overlay");
      modal.classList.toggle("modal-box--hidden");
      modalOverlay.classList.toggle("modal-box--hidden");
    });

    const btnAddNewClock = document.querySelector("#btn-addNew-clock");
    btnAddNewClock.addEventListener("click", this._addWorldClock.bind(this));

    const selectZone = document.querySelector("#selectZone");       
    selectZone.addEventListener("change", () => {
      const zone = document.querySelector("#selectZone");       
      this._currentZone = zone.value; 
      this._currentState = '-';
      this._fillStates();      
      this._fillCities(); 
    });

    const selectState = document.querySelector("#selectState");       
    selectState.addEventListener("change", () => {
      const state = document.querySelector("#selectState");       
      this._currentState = state.value; 
      this._fillCities();      
    }); 

    const selectCity = document.querySelector("#selectCity");       
    selectCity.addEventListener("change", () => {
      const city = document.querySelector("#selectCity");             
      this._currentCity = city.value;       
    });    
  
  }

  _startWatchingCurrentClock() {
    console.log("TimeZoneApplication : _startWatchingCurrentClock()"); 
    setInterval(this._updateMainClock.bind(this), 1000);
  }

  _startWatchingWorldClocks() {
    console.log("TimeZoneApplication : _startWatchingWorldClocks()"); 
    // mise à jour toutes les minutes seulement pour éviter de surcharger le serveur de l'api
    setInterval(this._updateWorldClocks.bind(this), 60000);
  }

  _init() {
    console.log("TimeZoneApplication : _init()"); 
    this._loadLocations();
    this._initEvents();
    this._startWatchingCurrentClock();
  }

  executeAction(action) {
    switch (action) {
      case this._actions.INIT:
        this._init();        
        break;
    
      default:
        break;
    }
  }
}