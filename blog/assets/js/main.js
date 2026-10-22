// Emberlog home page — interactions
(function () {
  'use strict';

  // Mobile nav
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Writing dropdown (10 latest posts)
  var menuBtn = document.getElementById('blogMenuBtn');
  var menuItem = menuBtn ? menuBtn.closest('.nav-item') : null;
  if (menuBtn && menuItem) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menuItem.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!menuItem.contains(e.target)) {
        menuItem.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        menuItem.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  // Scroll reveal
  var revealTargets = document.querySelectorAll('.featured, .card, .topic, .about > *, .newsletter > *');
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('visible'); });
  }

  // Newsletter form (demo only — no backend)
  var form = document.getElementById('subscribeForm');
  var msg = document.getElementById('formMsg');
  if (form && msg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var value = (input.value || '').trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      msg.classList.toggle('error', !valid);
      msg.textContent = valid
        ? 'Thanks! Check ' + value + ' to confirm your subscription.'
        : 'Please enter a valid email address.';
      if (valid) { input.value = ''; }
    });
  }
})();
