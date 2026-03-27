/* ════════════════════════════════════════════════
   POURNAMI KRISHNAKUMARI — UXR PORTFOLIO
   Main JavaScript
   ════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Utility: debounce ── */
  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /* ════════════════════════════════
     BACK TO TOP — declared early so
     onScroll can reference it
     ════════════════════════════════ */
  const backToTop = document.getElementById('backToTop');

  /* ════════════════════════════════
     NAVBAR — scroll behaviour
     ════════════════════════════════ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    /* Scrolled class */
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    /* Active link highlight */
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) currentId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });

    /* Back-to-top */
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }

  window.addEventListener('scroll', debounce(onScroll, 10));
  onScroll(); // run once on load

  /* ════════════════════════════════
     MOBILE NAV TOGGLE
     ════════════════════════════════ */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const open = navMenu.classList.contains('open');
    navToggle.setAttribute('aria-expanded', open);
    /* Animate hamburger → X */
    const spans = navToggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  /* Close mobile menu when a link is clicked */
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ════════════════════════════════
     RECOGNITION FILTERS
     ════════════════════════════════ */
  const filterBtns    = document.querySelectorAll('.rec-filter');
  const testimonials  = document.querySelectorAll('.testimonial-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      /* Update active button */
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      testimonials.forEach(card => {
        if (filter === 'all' || card.dataset.type === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeSlideIn 0.35s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ════════════════════════════════
     INTERSECTION OBSERVER — AOS
     ════════════════════════════════ */
  const aosObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          aosObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

  /* Also observe project cards, timeline items, skill cards, edu cards, pub cards, testimonial cards */
  const animatables = document.querySelectorAll(
    '.project-card, .timeline-item, .skill-card, .edu-card, .pub-card, .testimonial-card, .rec-count'
  );
  animatables.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
    aosObserver.observe(el);
  });

  /* ════════════════════════════════
     SMOOTH SCROLL OFFSET (for fixed nav)
     ════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ════════════════════════════════
     STAT COUNTER ANIMATION
     ════════════════════════════════ */
  function animateCounter(el, from, to, duration, suffix) {
    const start = performance.now();
    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value    = Math.round(from + (to - from) * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num');
  const statTargets = [
    { val: 10,   suffix: '+ ' },
    { val: 130,  suffix: '%'  },
    { val: 83,   suffix: '%'  },
    { val: 3,    suffix: ''   },
    { val: 2900, suffix: '+'  },
  ];

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        statNums.forEach((el, i) => {
          const t = statTargets[i];
          if (!t) return;
          /* Preserve the inner structure with .stat-plus span */
          const numSpan = el;
          const plus    = numSpan.querySelector('.stat-plus');
          if (plus) {
            const plusText = plus.textContent;
            animateCounterWithSpan(numSpan, 0, t.val, 1400, plusText);
          } else {
            animateCounter(el, 0, t.val, 1400, '');
          }
        });
        statsObserver.unobserve(statsSection);
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  function animateCounterWithSpan(el, from, to, duration, spanContent) {
    const start = performance.now();
    const spanEl = el.querySelector('.stat-plus');
    function update(time) {
      const elapsed  = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(from + (to - from) * eased);
      /* Update just the text node before the span */
      const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = value;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ════════════════════════════════
     FEATURED CARD — subtle pulse
     ════════════════════════════════ */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .project-card, .timeline-item, .skill-card,
    .edu-card, .pub-card, .testimonial-card, .rec-count {
      opacity: 0;
      transform: translateY(25px);
      transition: opacity 0.55s ease, transform 0.55s ease,
                  border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .project-card.aos-animate, .timeline-item.aos-animate,
    .skill-card.aos-animate, .edu-card.aos-animate,
    .pub-card.aos-animate, .testimonial-card.aos-animate,
    .rec-count.aos-animate {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  /* ════════════════════════════════
     PROJECT CARD — Google color
     highlight on hover
     ════════════════════════════════ */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--hover-glow', '0 8px 40px rgba(79,70,229,0.18)');
    });
  });

})();
