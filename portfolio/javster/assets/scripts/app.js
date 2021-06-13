const root = document.documentElement;

function parallax(e) {
  let _w = window.innerWidth/2;
  let _h = window.innerHeight/2;
  let _mouseX = e.clientX;
  let _mouseY = e.clientY;
  let _deltaX = `${ (_mouseX - _w) * 0.02}`;
  let _deltaY = `${ (_mouseY - _h) * 0.015}`;
  
  root.style.setProperty('--mouse-x', _deltaX + "vmin");
  root.style.setProperty('--mouse-y', _deltaY + "vmin");
}

// Original Audio player : https://codepen.io/idorenyinudoh/pen/dypLvEN?editors=0010
class AudioPlayer extends HTMLElement {
    constructor() {
        super();
        const template = document.querySelector('template');
        const templateContent = document.importNode(template.content, true);//template.content;
        const player = document.querySelector('#audioPlayer');
        player.prepend(templateContent);
        // const shadow = this.attachShadow({mode: 'open'});
        // shadow.appendChild(templateContent.cloneNode(true));
    }
}

customElements.define('audio-player', AudioPlayer);
document.addEventListener("mousemove", parallax);

const audioPlayerContainer = document.getElementById('audio-player-container');
const audio = audioPlayerContainer.querySelector('audio');

const btnPlay = audioPlayerContainer.querySelector('#btnPlay');   
const seekSlider = audioPlayerContainer.querySelector('#seek-slider');
const volumeSlider = audioPlayerContainer.querySelector('#volume-slider');
const muteBtn = audioPlayerContainer.querySelector('#btnMute');
const durationContainer = audioPlayerContainer.querySelector('#duration');
const currentTimeContainer = audioPlayerContainer.querySelector('#current-time');
const outputContainer = audioPlayerContainer.querySelector('#volume-output');

const equalizer = document.getElementById('equalizer');
const soundWave = document.getElementById('soundWave');

let playState = 'play';
let muteState = 'unmute';
let raf = null;

const whilePlaying = () => {
  seekSlider.value = Math.floor(audio.currentTime);
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
  raf = requestAnimationFrame(whilePlaying);
};

const showRangeProgress = (rangeInput) => {
  if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
  else audioPlayerContainer.style.setProperty('--volume-before-width', ((rangeInput.value) / rangeInput.max * 100)  + '%');
};

const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

const displayDuration = () => {
  durationContainer.textContent = calculateTime(audio.duration);
};

const setSliderMax = () => {
  seekSlider.max = Math.floor(audio.duration);
};

const displayBufferedAmount = () => {
  const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
  audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
};

btnPlay.addEventListener('click', (evt) => {
  console.log(audio.src);
  if (audio.getAttribute("src") !== "") {
    if(playState === 'play') {      
      audio.play();
      requestAnimationFrame(whilePlaying);
      playState = 'pause';
      evt.currentTarget.classList.add('paused');
      if(muteState === 'unmute') {
        equalizer.classList.add('play');
        soundWave.classList.add('play');
      }  
    } else {
      audio.pause();
      playState = 'play';
      evt.currentTarget.classList.remove('paused');
      
      equalizer.classList.remove('play');
      soundWave.classList.remove('play');
      
    }
  }
});

btnMute.addEventListener('click', (evt) => {
  if(muteState === 'unmute') {
    audio.muted = true;
    muteState = 'mute';
    evt.currentTarget.classList.add('mute');    
    equalizer.classList.remove('play');
    soundWave.classList.remove('play');
  } else {
    audio.muted = false;
    muteState = 'unmute';
    evt.currentTarget.classList.remove('mute');
    if(!audio.paused) {
      equalizer.classList.add('play');
      soundWave.classList.add('play');    
    }
  }
});

audio.addEventListener('progress', displayBufferedAmount);

seekSlider.addEventListener('input', (e) => {
  showRangeProgress(e.target);
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  if(!audio.paused) {
    cancelAnimationFrame(raf);
  }
});

seekSlider.addEventListener('change', () => {
  audio.currentTime = seekSlider.value;
  if(!audio.paused) {
    requestAnimationFrame(whilePlaying);
  }
});

volumeSlider.addEventListener('input', (e) => {
  const value = e.target.value;
  showRangeProgress(e.target);
  outputContainer.textContent = value;
  audio.volume = value / 100;
});


let lastRadioItem;

const chooseRadio = (evt) => {
  let radioUrl = evt.currentTarget.dataset.streamUrl;

  audio.setAttribute('src', radioUrl);

  
  if (lastRadioItem !== undefined) {
    lastRadioItem.classList.toggle('play');
  }
  lastRadioItem = evt.currentTarget;
  lastRadioItem.classList.toggle('play');
};

let radioItems = document.querySelectorAll('.radios__list-item');
radioItems.forEach((el) => {
  el.addEventListener('click', chooseRadio);
});
