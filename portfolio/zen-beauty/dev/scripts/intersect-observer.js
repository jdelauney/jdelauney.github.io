const threshold = 0.5;
const options = {
  root: null,
  rootMargin: '0px',
  threshold
};

const handleIntersect = function (entries, observer) {
  entries.forEach(function (entry) {
    console.log(entry.intersectionRatio);  
    if (entry.intersectionRatio > threshold) {
      entry.target.classList.remove('reveal');
      //observer.unobserve(entry.target);
    }
  });
};

document.documentElement.classList.add('reveal-loaded');

window.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver(handleIntersect, options);
  const targets = document.querySelectorAll('.reveal');
  console.log(targets);
  targets.forEach(function (target) {
    observer.observe(target);
  });
});