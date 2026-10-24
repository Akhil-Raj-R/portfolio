const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* =============================================
   PORTFOLIO JAVASCRIPT
   Animations, Interactions & Effects
   ============================================= */

// ---- PARTICLE BACKGROUND ----
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const NUM = 80;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      const colors = ['#00f5ff', '#b54bff', '#ff2d78', '#ffe000'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  for (let i = 0; i < NUM; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00f5ff';
          ctx.globalAlpha = (1 - dist / 100) * 0.08;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    if (!RM) requestAnimationFrame(animate);
  }
  animate();
})();


// ---- NAVBAR SCROLL EFFECT ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});


// ---- ACTIVE NAV LINK ----
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}


// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


// ---- TYPEWRITER EFFECT ----
const phrases = [
  'Technical Lead',
  'Full Stack Java Developer',
  'Spring Boot & React Engineer',
  'Team Mentor',
  'Process Automation'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeEl = document.getElementById('typewriter');

function typewriter() {
  const phrase = phrases[phraseIndex];
  if (isDeleting) {
    typeEl.textContent = phrase.substring(0, charIndex--);
    if (charIndex < 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typewriter, 500);
      return;
    }
    setTimeout(typewriter, 40);
  } else {
    typeEl.textContent = phrase.substring(0, charIndex++);
    if (charIndex > phrase.length) {
      isDeleting = true;
      setTimeout(typewriter, 2000);
      return;
    }
    setTimeout(typewriter, 80);
  }
}
if (RM) { typeEl.textContent = phrases[0]; } else { setTimeout(typewriter, 800); }


// ---- SCROLL REVEAL ANIMATIONS ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = (i % 6) * 80;
  revealObserver.observe(el);
});


// ---- HERO NAME GLITCH ANIMATION ----
const heroName = document.getElementById('hero-name');
const originalText = heroName.textContent;
const glitchChars = '!@#$%^&*<>{}[]|01';
let glitchInterval;

function glitchName() {
  let iterations = 0;
  clearInterval(glitchInterval);
  glitchInterval = setInterval(() => {
    heroName.textContent = originalText.split('').map((char, index) => {
      if (index < iterations) return originalText[index];
      if (char === ' ') return ' ';
      return glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }).join('');
    if (iterations >= originalText.length) {
      clearInterval(glitchInterval);
      heroName.textContent = originalText;
    }
    iterations += 0.4;
  }, 30);
}

// Glitch on hover
heroName.addEventListener('mouseenter', glitchName);
// Initial glitch after load
if (!RM) setTimeout(glitchName, 1500);


// ---- PROJECT CARD 3D TILT ----
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 6;
    const rotateY = (x / rect.width) * 6;
    card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ---- SMOOTH SCROLL FOR NAV LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ---- CONTACT FORM (opens the visitor's email app) ----
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('fname').value.trim();
  const from = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim() || 'Portfolio enquiry';
  const msg = document.getElementById('fmessage').value.trim();
  const body = msg + '\n\nFrom: ' + name + ' (' + from + ')';
  const original = submitBtn.innerHTML;
  window.location.href = 'mailto:1999akhil@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  submitBtn.innerHTML = '<span>Opening your email app\u2026</span>';
  setTimeout(() => { submitBtn.innerHTML = original; }, 3000);
});


// ---- FLOATING BADGES PARALLAX ----
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelectorAll('.floating-badge').forEach((el, i) => {
    const factor = (i + 1) * 0.5;
    el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});


// ---- NEON GLOW CURSOR TRAIL ----
const trail = [];
const TRAIL_LENGTH = 12;
for (let i = 0; i < (RM ? 0 : TRAIL_LENGTH); i++) {
  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  dot.style.cssText = `
    position:fixed;pointer-events:none;z-index:9999;border-radius:50%;
    background:rgba(0,245,255,${(1 - i / TRAIL_LENGTH) * 0.4});
    width:${(TRAIL_LENGTH - i) * 2}px;height:${(TRAIL_LENGTH - i) * 2}px;
    transform:translate(-50%,-50%);transition:all ${i * 10}ms linear;
    mix-blend-mode:screen;
  `;
  document.body.appendChild(dot);
  trail.push(dot);
}
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  trail.forEach((dot, i) => {
    setTimeout(() => {
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    }, i * 20);
  });
});


// ---- STAT COUNTER ANIMATION ----
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const duration = 1500;
  const step = target / (duration / 16);
  const update = () => {
    current = Math.min(current + step, target);
    const display = Number.isInteger(target) ? Math.floor(current) : Math.round(current * 10) / 10;
    el.textContent = display + suffix;
    if (current < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    const statNums = document.querySelectorAll('.stat-num');
    const values = [5, 20, 30, 95];
    const suffixes = ['', '%', '%', '%'];
    statNums.forEach((el, i) => animateCounter(el, values[i], suffixes[i]));
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);


// ---- THEME TOGGLE (dark / light) ----
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const ico = document.getElementById('theme-ico');
  const lbl = document.getElementById('theme-lbl');
  const moon = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
  const sun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  const cur = () => root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  function paint() {
    const dark = cur() === 'dark';
    ico.innerHTML = dark ? sun : moon;
    lbl.textContent = dark ? 'Light' : 'Dark';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  btn.addEventListener('click', () => {
    const next = cur() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    paint();
  });
  paint();
})();
