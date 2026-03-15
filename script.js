/* ==========================================
   SCRIPT.JS — Harsh Soni Portfolio
   ========================================== */

'use strict';

// =====================
// LOADER
// =====================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      // Trigger hero reveals after loader
      setTimeout(() => initReveal(), 200);
    }
  }, 1200);
});

// =====================
// CUSTOM CURSOR
// =====================
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Scale on interactive elements
  const interactives = document.querySelectorAll('a, button, [data-tilt], .skill-tag, .vision-pillar');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      follower.style.width = '56px';
      follower.style.height = '56px';
      follower.style.borderColor = 'rgba(255,255,255,0.35)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.width = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(255,255,255,0.25)';
    });
  });
})();

// =====================
// NAV SCROLL EFFECT
// =====================
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// =====================
// MOBILE MENU
// =====================
(function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;
  let open = false;

  toggle.addEventListener('click', () => {
    open = !open;
    menu.classList.toggle('open', open);
    toggle.style.opacity = open ? '0.5' : '1';
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      open = false;
      menu.classList.remove('open');
      toggle.style.opacity = '1';
      document.body.style.overflow = '';
    });
  });
})();

// =====================
// SMOOTH NAV SCROLL
// =====================
document.querySelectorAll('[data-nav], .nav-cta').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// =====================
// HERO CANVAS — PARTICLE FIELD
// =====================
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.25 + 0.05;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,200,210,${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Mouse influence
  let mx = W / 2, my = H / 2;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.07;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(200,200,210,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      // Subtle mouse attraction
      const dx = mx - p.x, dy = my - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        p.vx += (dx / dist) * 0.003;
        p.vy += (dy / dist) * 0.003;
      }
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.update();
      p.draw();
    });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();

// =====================
// HERO TITLE TYPEWRITER
// =====================
(function initTypewriter() {
  const el = document.getElementById('heroTitle');
  if (!el) return;
  const titles = [
    'Aspiring DevOps Engineer',
    'Cloud Infrastructure Builder',
    'AI & MLOps Explorer',
    'Technical Leader',
    'Aggressive Problem Solver',
    'Fast Learner & Builder',
  ];
  let idx = 0, charIdx = 0, deleting = false;
  const TYPING_SPEED = 70;
  const DELETING_SPEED = 35;
  const PAUSE = 2000;

  function type() {
    const current = titles[idx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, PAUSE);
        return;
      }
      setTimeout(type, TYPING_SPEED);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % titles.length;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, DELETING_SPEED);
    }
  }
  setTimeout(type, 1400);
})();

// =====================
// HERO PARALLAX & MOUSE
// =====================
(function initHeroParallax() {
  const heroContent = document.getElementById('heroContent');
  const geos = document.querySelectorAll('.geo');
  const orbs = document.querySelectorAll('.hero-orb');

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetX = (e.clientX - cx) / cx;
    targetY = (e.clientY - cy) / cy;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    if (heroContent) {
      heroContent.style.transform = `translate(${currentX * 8}px, ${currentY * 6}px)`;
    }

    geos.forEach((geo, i) => {
      const factor = (i + 1) * 6;
      const dir = i % 2 === 0 ? 1 : -1;
      geo.style.transform = `translate(${currentX * factor * dir}px, ${currentY * factor}px)`;
    });

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 12;
      orb.style.transform = `translate(${currentX * factor}px, ${currentY * factor * 0.6}px)`;
    });

    requestAnimationFrame(animate);
  }
  animate();
})();

// =====================
// SCROLL REVEAL
// =====================
function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('is-visible'), delay * 1000);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

// =====================
// COUNTER ANIMATION
// =====================
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// =====================
// SKILL BARS
// =====================
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const width = bar.dataset.width;
      bar.style.width = width + '%';
      observer.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
})();

// =====================
// CARD TILT EFFECT
// =====================
(function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    let rect;
    let rafId;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', e => {
      if (!rect) return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = -((y - cy) / cy) * 6;
        const rotateY = ((x - cx) / cx) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
        card.style.transition = 'transform 0.1s linear';
      });
    });

    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(rafId);
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
})();

// =====================
// CONTACT FORM
// =====================
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.style.opacity = '0.6';
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending...';

    setTimeout(() => {
      form.reset();
      btn.style.opacity = '1';
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
      if (successEl) {
        successEl.classList.add('visible');
        successEl.style.display = 'block';
        setTimeout(() => successEl.classList.remove('visible'), 4000);
      }
    }, 1200);
  });
})();

// =====================
// DOWNLOAD RESUME
// =====================
(function initResume() {
  const btn = document.getElementById('downloadResume');
  if (!btn) return;
  btn.href = 'resume.pdf';
  btn.setAttribute('download', 'Harsh_Yogesh_Soni_Resume.pdf');
  btn.removeAttribute('target');
})();

// =====================
// ACTIVE NAV LINK HIGHLIGHTING
// =====================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--white)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

// =====================
// PARALLAX SCROLL DEPTH
// =====================
(function initScrollParallax() {
  const geos = document.querySelectorAll('.geo');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    geos.forEach((geo, i) => {
      const speed = (i + 1) * 0.15;
      const y = scrollY * speed;
      const currentTransform = geo.style.transform || '';
      // Only update if not under mouse influence
      geo.style.setProperty('--scroll-y', `${y}px`);
    });
  }, { passive: true });
})();

// =====================
// ACHIEVEMENTS SECTION — ENHANCED
// =====================
(function initAchievements() {
  const bars = document.querySelectorAll('.achieve-bar');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      bar.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.2), transparent)';
      bar.style.transition = 'background 1s ease';
      observer.unobserve(bar);
    });
  }, { threshold: 0.5 });
  bars.forEach(b => observer.observe(b));
})();

// =====================
// SECTION ENTRY TRANSITIONS (BORDER GLOW)
// =====================
(function initSectionGlow() {
  const sections = document.querySelectorAll('.section');
  const cards = document.querySelectorAll('.about-card, .timeline-card, .skill-cluster, .project-card, .achieve-card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      // Staggered child entry
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(s => observer.observe(s));
})();

// =====================
// TECH ICON MOUSE PARALLAX
// =====================
(function initTechIconParallax() {
  const wrap = document.getElementById('techIconsWrap');
  if (!wrap) return;
  const icons = wrap.querySelectorAll('.tech-icon');

  let mx = 0, my = 0;
  let rafId;

  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    mx = (e.clientX - rect.left - rect.width / 2) / rect.width;
    my = (e.clientY - rect.top - rect.height / 2) / rect.height;

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      icons.forEach(icon => {
        const depth = parseFloat(icon.dataset.depth || 1);
        const tx = mx * depth * 14;
        const ty = my * depth * 10;
        icon.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    });
  });

  wrap.addEventListener('mouseleave', () => {
    cancelAnimationFrame(rafId);
    icons.forEach(icon => {
      icon.style.transform = 'translate(0, 0)';
    });
  });
})();
