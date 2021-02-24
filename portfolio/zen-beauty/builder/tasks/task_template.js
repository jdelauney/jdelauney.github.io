/*------------------------------------------------------------------------------------------------- 
 * Tâche Gulpjs : myTask
 *
 * Votre description
 *
 * 
 * Ligne de commande : gulp myTask
 *
 * ------------------------------------------------------------------------------------------------
 * SassSwing framework
 * https://github.com/sassswing/sass-swing
 * Licensed under MIT Open Source
  ------------------------------------------------------------------------------------------------- */

/* Importation de Gulpjs */
const { src, dest, task } = require('gulp');

/* Importation des paramètres de configuration du projet */
const config = require('../settings');

/* Importation des modules Gulpjs*/


/*
 * * Ma tache
 */
 function myTask(callback) {

  src(`{$SRCDIR}`, { allowEmpty: true }) 
       .pipe(`{$GULP-ACTION}`)
       .pipe(dest(`{$DESTDIR}`)         
     );  
  callback();       
}

/*
 * Enregistrement de la tâche dans Gulp
 */
task('myTask', myTask);