/**
 * * Gestionnaire d'évenement pour le tableau des jours du calendrier (utilisé en interne dans le composant "DatePicker")
 * @Scope [PRIVATE]
 * @param  {Object} Element Element DOM du jour à gérer
 * @param  {Object} datePicker Référence vers notre composant "DatePicker"
 * @param  {Number} index index du jour dans le mois en cours
 * @param  {Number} row numero de la ligne d'affichage dans le tableau
 * @param  {Number} column numero de la colonne d'affichage dans le tableau
*/
const DatePickerDayHandler = function (Element, datepicker, index, row, column) {
};


/**
 * * Gestionnaire d'un calendrier sous forme de modale, pour choisir une date
 * @Scope [PUBLIC]
 * @param  {Object} buttonelement bouton ouvrant la boite de dialogue
 * @param  {Object} dialogElement Element décrivant la boite dialogue
*/
const DatePicker = function (buttonelement, dialogElement) {
  this.dayLabels = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  this.monthLabels = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];

  this.messageInfo = 'Utilisez le clavier pour naviguer';
  this.lastMessage = '';

  this.buttonElement  = buttonElement;
  this.dialogElement  = dialogElement;
  this.messageElement = this.dialogElement.querySelector('#popup-calendar-msg');

  this.displayDateElement = this.dialogElement.querySelector('#popup-calendar-dateLabel');

  this.btnNextMonth = this.dialogElement.querySelector('#popup-calendar-btn-nextMonth');
  this.btnPrevMonth = this.dialogElement.querySelector('#popup-calendar-btn-prevMonth');

  // this.btnNextYear = this.dialogElement.querySelector('popup-calendar-btn-nextYear');
  // this.btnPrevYear = this.dialogElement.querySelector('popup-calendar-btn-prevYear');

  this.btnApply = this.dialogElement.querySelector('#popup-calendar-btn-apply');
  this.btnCancel = this.dialogElement.querySelector('#popup-calendar-btn-cancel');

  this.tableBody = this.dialogElement.querySelector('#popup-calendar-dates tbody');

  this.days = [];

  this.focusDate = new Date();
  this.selectedDay =  new Date(0,0,1);

  /* Drapeau pour savoir si l'utilisateur à cliquer en dehors de la boite de dialogue, pour pouvoir fermer celle-ci */
  this.isClickOutside = false;

  /* 
  * * La méthode Object.freeze() permet de geler un objet, c'est-à-dire qu'on empêche d'ajouter de nouvelles propriétés, de supprimer ou d'éditer des propriétés existantes
  * * https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/freeze
  */
  this.keyCode = Object.freeze({
    'TAB': 9,
    'ENTER': 13,
    'ESC': 27,
    'SPACE': 32,
    'PAGEUP': 33,
    'PAGEDOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });

};
/**
 * * Procedure d'initialisation de notre composant DatePicker
 */
DatePicker.prototype.init = function () {

  /* Mise en place des gestionnaires d'évènements */

  /* Initialise et affiche le calendrier */
};

/**
* * Mise à jour du calendrier
*/
DatePicker.prototype.updateGrid = function () {
};

/**
 * Donne le focus à la date du jour en fonction du paramètre "select"
 * @param  {Boolean} select . Si true alors la date du jour obtiens le focus
 */
DatePicker.prototype.setFocusDay = function (select) {
};

/**
 * * Met à jour le calendrier en fonction du jour "day" sélectionné
 * @param  {Number} day le numéro du jour sélectionné sur le calendrier
 */
DatePicker.prototype.updateFocusDay = function (day) {
};

/**
* * Retourne les dates du mois précédent
*/
DatePicker.prototype.getDaysInLastMonth = function () {
};

/**
* * Retourne le nombre de jour dans un mois
*/
DatePicker.prototype.getDaysInMonth = function () {
};

/**
* * Affiche le calendrier
*/
DatePicker.prototype.show = function () {
};

/**
* * Retourne TRUE si le calendrier est déja affiché
*/
DatePicker.prototype.isOpen = function () {
  return window.getComputedStyle(this.dialogNode).display !== 'none';
};

/**
* * Cache le calendrier
*/
DatePicker.prototype.hide = function () {
};

/**
* * Gestionnaire d'évènement pour vérifier si un clique est effectué en dehors de la boite de dialogue
*/
DatePicker.prototype.handleBackgroundMouseDown = function (event) {
};

DatePicker.prototype.handleBackgroundMouseUp = function () {
  this.isMouseDownOnBackground = false;
};

/**
* * Gestionnaire d'évènement pour le bouton "btnApply"
*/
DatePicker.prototype.handleApplyButton = function (event) {
};

/**
* * Gestionnaire d'évènement pour le bouton "btnCancel"
*/
DatePicker.prototype.handleCancelButton = function (event) {
};

/**
* * Gestionnaire d'évènement pour le bouton "btnNextMonth"
*/
DatePicker.prototype.handleNextMonthButton = function (event) {
};

/**
* * Gestionnaire d'évènement pour le bouton "btnPrevMonth"
*/
DatePicker.prototype.handlePrevMonthButton = function (event) {
};

/**
* * Se déplace vers le mois suivant
*/
DatePicker.prototype.moveToNextMonth = function () {
};

/**
* * Se déplace vers le mois précédent
*/
DatePicker.prototype.moveToPrevMonth = function () {
};

/**
* * Se déplace sur le jour choisi
*/
DatePicker.prototype.moveFocusToDay = function (day) {
};

/**
* * Se déplace vers le jour suivant
*/
DatePicker.prototype.moveFocusToNextDay = function () {
};

/**
* * Se déplace vers le jour précédent
*/
DatePicker.prototype.moveFocusToPrevDay = function () {
};

/**
* * Se déplace vers la semaine suivante
*/
DatePicker.prototype.moveFocusToNextWeek = function () {
};

/**
* * Se déplace vers la semaine précédente
*/
DatePicker.prototype.moveFocusToPrevWeek = function () {
};

/**
* * Se déplace vers le premier jour de la semaine
*/
DatePicker.prototype.moveFocusToFirstDayOfWeek = function () {
};

/**
* * Se déplace vers le dernier jour de la semaine
*/
DatePicker.prototype.moveFocusToLastDayOfWeek = function () {
};

/**
* * Retourne une chaine de caractère formatté pour l'affichage de la date.
* @param  {Number} year Année
* @param  {Number} month Mois
* @param  {Number} day Jour
*/
DatePicker.prototype.getDateLabel = function (year, month, day) {
};

/**
* * Affiche un nouveau message à l'emplacement réserver à celui-ci dans la boite de dialogue
* @param  {String} msg Le message
*/
DatePicker.prototype.setMessage = function (msg) {
};


