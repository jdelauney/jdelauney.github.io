/**==========================================================================================================
 *
 *
 *===========================================================================================================*/

import QuizzardApplication from './quizzardapplication.js';


/*=====[ APPLICATION METHODS TEST ]===========================================================================*/

// function runApp(jsonData) {
//   const quizzard = new QuizzardManager(jsonData);
//   console.log("Quizzard contient " + quizzard.getQuizzCount() + " questionnaire");
//   quizzard.loadQuizz(0);
//   console.log("Premier questionnaire sur le theme : " + quizzard.getQuizzTheme() + " chargé.");
//   console.log("Ce questionnaire contient " + quizzard.getSectionCount() + " sections.");  
//   console.log("Au total ce questionnaire contient " + quizzard.getTotalQuestionCount() + " questions.");  
//   quizzard.loadSection(0);
//   console.log("La première section contient " + quizzard.getSectionQuestionCount() + " questions.");  
//   console.log('Questions ==>');
//   console.log(quizzard.getQuestions());
//   console.log('La premiere question contient ==> ');
//   console.log(quizzard.getQuestionItem(0)); 
// }
// function runApi(url, callback) {
//   fetch(url).then((response) => {
//     return response.json();
//   }).then((obj) => {
//     runApp(obj);
//   }).catch((error) => {
//     console.error('Un problème est survenu lors du chargement des données !');
//     console.error(error);
//   });
// }

/*=====[ MAIN APPLICATION ]==================================================================================*/

console.log('Welcome in App.js');

const quizzarApp = new QuizzardApplication();

	window.addEventListener("load", function() {
		quizzarApp.runApplication("init");
	}, true);

/*===========================================================================================================*/