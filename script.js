const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const memberSlides = Array.from(document.querySelectorAll('.member-slide'));
const carouselStatus = document.querySelector('.carousel-status');
const pauseButton = document.querySelector('.carousel-pause');
const carousel = document.querySelector('.member-voices');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (memberSlides.length && carousel) {
  let active = 0;
  let paused = reduceMotion.matches;
  let timer;
  function showSlide(next) {
    active = (next + memberSlides.length) % memberSlides.length;
    memberSlides.forEach((slide, index) => {
      const current = index === active;
      slide.classList.toggle('is-current', current);
      slide.setAttribute('aria-hidden', String(!current));
    });
    if (carouselStatus) carouselStatus.textContent = (active + 1) + ' of ' + memberSlides.length;
  }
  function updateButton() {
    if (!pauseButton) return;
    pauseButton.textContent = paused ? 'Resume rotation' : 'Pause rotation';
    pauseButton.setAttribute('aria-pressed', String(paused));
  }
  function stop() {
    if (timer) window.clearInterval(timer);
    timer = undefined;
  }
  function start() {
    stop();
    if (!paused && !document.hidden) timer = window.setInterval(() => showSlide(active + 1), 7000);
  }
  carousel.querySelectorAll('[data-direction]').forEach(button => {
    button.addEventListener('click', () => {
      showSlide(active + Number(button.dataset.direction));
      start();
    });
  });
  if (pauseButton) pauseButton.addEventListener('click', () => {
    paused = !paused;
    updateButton();
    start();
  });
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', event => {
    if (!carousel.contains(event.relatedTarget)) start();
  });
  document.addEventListener('visibilitychange', start);
  reduceMotion.addEventListener('change', event => {
    paused = event.matches;
    updateButton();
    start();
  });
  showSlide(0);
  updateButton();
  start();
}
