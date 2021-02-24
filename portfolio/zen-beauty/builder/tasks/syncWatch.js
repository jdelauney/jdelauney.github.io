/*------------------------------------------------------------------------------------------------- 
 * Tâche Gulpjs : syncWatch
 *
 * Tâche lançant un serveur de développement web pour une rechargement automatique de la page dans 
 * le navigateur. Surveille les modifications des fichiers d'un projet et effectue les traitements 
 * adequat automatiquement :
 *  - Compilation des fichiers Sass avec prefixage automatique et regroupement des media-queries
 *  - Surveille la modifications des fichiers scss, js et html
 * 
 * Ligne de commande : gulp syncWatch
 *
 * ------------------------------------------------------------------------------------------------
 * SassSwing framework
 * https://github.com/sassswing/sass-swing
 * Licensed under MIT Open Source
  ------------------------------------------------------------------------------------------------- */

const { src, dest, task } = require('gulp');
const config = require('../settings');


/* Pour compiler les fichiers sass */
const sass = require('gulp-dart-sass');
/* Pour faire du post-process sur les fichiers css */
const postcss = require('gulp-postcss');
/* Pour créer un serveur local permettant un rafraîchissement live */
const browserSync = require('browser-sync').create();

/* ------------------------------------------------------------------------------------------
 * * [ Méthodes POST-PROCESS ]
 -------------------------------------------------------------------------------------------*/
/* Autoprefix des propriétés et valeurs css */
const autoprefixer = require('autoprefixer');
/* Compactage des medias queries */
const mqpacker = require('mqpacker');

/*
 * * fonction interne pour la compilation des fichiers sass avec live server
 */
 function _dev_syncBuild_css() {
  const processors = [
    autoprefixer,
    mqpacker({sort: true})
  ];

  return src(`${config.css.scssDir}/default.scss`, { allowEmpty: true }) 
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(dest(`${config.css.DevDir}`))
        .pipe(browserSync.stream());
}

/*
 * * Observation et mise à jour des fichiers en live (en mode développement uniquement )
 */
 function syncWatch() {
    browserSync.init({
        server: {
            baseDir: "./dev"
        }
    });
    watch(`${config.css.scssDir}/*.scss`,  _dev_syncBuild_css);
    watch(`${config.js.scssDir}/**/*.js`).on('change', browserSync.reload);
    watch(`${config.srcDir}/**/*.html`).on('change', browserSync.reload);
 }

 //exports.syncWatch = syncWatch;
 task('syncWatch', syncWatch);