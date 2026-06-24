/* ════════════════════════════════════════════════
   script.js — DevCidadão | Cidadania & IA
   ════════════════════════════════════════════════ */
 
// ─────────────────────────────────────────────────
// 1. REDE NEURAL ANIMADA (Canvas Hero)
// ─────────────────────────────────────────────────
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
 /* ════════════════════════════════════════════════
   script.js — DevCidadão | Cidadania & IA
   ════════════════════════════════════════════════ */
 
// ─────────────────────────────────────────────────
// 1. REDE NEURAL ANIMADA (Canvas Hero)
// ─────────────────────────────────────────────────
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
 
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animId;
  const NODE_COUNT_DESKTOP = 80;
  const NODE_COUNT_MOBILE  = 40;
  const CONNECT_DIST = 160;
  const PULSE_SPEED  = 0.008;
 
  // Mouse position
  const mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
 
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildNodes();
  }
 
  function buildNodes() {
    const count = window.innerWidth < 640 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    nodes = Array.from({ length: count }, () => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      vx:  (Math.random() - 0.5) * 0.4,
      vy:  (Math.random() - 0.5) * 0.4,
      r:   Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2,
    }));
  }
 
  function draw(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    // Atualiza posições
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      n.phase += PULSE_SPEED;
 
      // Reiciar nas bordas
      if (n.x < 0) n.x = canvas.width;
      if (n.x > canvas.width)  n.x = 0;
      if (n.y < 0) n.y = canvas.height;
      if (n.y > canvas.height) n.y = 0;
 
      // Atração leve ao mouse
      const dx = mouse.x - n.x;
      const dy = mouse.y - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        n.vx += dx / dist * 0.02;
        n.vy += dy / dist * 0.02;
      }
 
      // Limite de velocidade
      const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (speed > 1.5) {
        n.vx = (n.vx / speed) * 1.5;
        n.vy = (n.vy / speed) * 1.5;
      }
    });
 
    // Desenha conexões
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
 
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
 
    // Desenha nós
    nodes.forEach(n => {
      const glow = Math.sin(n.phase) * 0.5 + 0.5;
 
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${0.4 + glow * 0.4})`;
      ctx.fill();
 
      // Anel de pulso suave
      ctx.beginPath();
      ctx.arc(n.x, n.y, (n.r + glow) * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${0.05 * glow})`;
      ctx.fill();
    });
 
    animId = requestAnimationFrame(draw);
  }
 
  // Observa visibilidade para economizar CPU
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animId) animId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
  }, { threshold: 0.1 });
 
  observer.observe(canvas.closest('.hero') || canvas);
 
  window.addEventListener('resize', debounce(resize, 250));
  resize();
})();
 
 
// ─────────────────────────────────────────────────
// 2. HEADER — efeito ao scrollar
// ─────────────────────────────────────────────────
(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
 
  const update = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
 
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
 
 
// ─────────────────────────────────────────────────
// 3. MENU MOBILE (hambúrguer)
// ─────────────────────────────────────────────────
(function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !navLinks) return;
 
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open', !expanded);
    document.body.style.overflow = !expanded ? 'hidden' : '';
  });
 
  // Fechar ao clicar em link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
 
  // Fechar com ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
})();
 
 
// ─────────────────────────────────────────────────
// 4. REVELAR ELEMENTOS AO SCROLLAR
// ─────────────────────────────────────────────────
(function initReveal() {
  const targets = document.querySelectorAll(
    '.projeto-card, .skill-group, .manifesto__item, .sobre__stats, .stat'
  );
 
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal--delay-1');
    if (i % 3 === 2) el.classList.add('reveal--delay-2');
  });
 
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
 
  targets.forEach(el => io.observe(el));
})();
 
 
// ─────────────────────────────────────────────────
// 5. CONTADORES ANIMADOS (sobre stats)
// ─────────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat__number[data-target]');
  if (!counters.length) return;
 
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
 
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const start = performance.now();
 
      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
 
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
 
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
 
  counters.forEach(el => io.observe(el));
})();
 
 
// ─────────────────────────────────────────────────
// 6. BARRAS DE HABILIDADE ANIMADAS
// ─────────────────────────────────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar__fill[data-width]');
  if (!bars.length) return;
 
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      // Pequeno delay para garantir que a classe reveal já aplicou
      setTimeout(() => {
        bar.style.width = bar.dataset.width + '%';
      }, 200);
      io.unobserve(bar);
    });
  }, { threshold: 0.4 });
 
  bars.forEach(bar => io.observe(bar));
})();
 
 
// ─────────────────────────────────────────────────
// 7. SCROLL SUAVE — nav links (respeita reduced-motion)
// ─────────────────────────────────────────────────
(function initSmoothScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
 
      const target = document.querySelector(id);
      if (!target) return;
 
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start',
      });
 
      // Atualiza o foco para acessibilidade
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    });
  });
})();
 
 
// ─────────────────────────────────────────────────
// 8. LINK ATIVO NA NAVEGAÇÃO (highlight de seção)
// ─────────────────────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;
 
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
 
  sections.forEach(s => io.observe(s));
})();
 
 
// ─────────────────────────────────────────────────
// UTILITÁRIO: debounce
// ─────────────────────────────────────────────────
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animId;
  const NODE_COUNT_DESKTOP = 80;
  const NODE_COUNT_MOBILE  = 40;
  const CONNECT_DIST = 160;
  const PULSE_SPEED  = 0.008;
 
  // Mouse position
  const mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
 
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildNodes();
  }
 
  function buildNodes() {
    const count = window.innerWidth < 640 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    nodes = Array.from({ length: count }, () => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      vx:  (Math.random() - 0.5) * 0.4,
      vy:  (Math.random() - 0.5) * 0.4,
      r:   Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2,
    }));
  }
 
  function draw(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    // Atualiza posições
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      n.phase += PULSE_SPEED;
 
      // Reiciar nas bordas
      if (n.x < 0) n.x = canvas.width;
      if (n.x > canvas.width)  n.x = 0;
      if (n.y < 0) n.y = canvas.height;
      if (n.y > canvas.height) n.y = 0;
 
      // Atração leve ao mouse
      const dx = mouse.x - n.x;
      const dy = mouse.y - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        n.vx += dx / dist * 0.02;
        n.vy += dy / dist * 0.02;
      }
 
      // Limite de velocidade
      const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (speed > 1.5) {
        n.vx = (n.vx / speed) * 1.5;
        n.vy = (n.vy / speed) * 1.5;
      }
    });
 
    // Desenha conexões
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
 
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
 
    // Desenha nós
    nodes.forEach(n => {
      const glow = Math.sin(n.phase) * 0.5 + 0.5;
 
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${0.4 + glow * 0.4})`;
      ctx.fill();
 
      // Anel de pulso suave
      ctx.beginPath();
      ctx.arc(n.x, n.y, (n.r + glow) * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${0.05 * glow})`;
      ctx.fill();
    });
 
    animId = requestAnimationFrame(draw);
  }
 
  // Observa visibilidade para economizar CPU
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animId) animId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
  }, { threshold: 0.1 });
 
  observer.observe(canvas.closest('.hero') || canvas);
 
  window.addEventListener('resize', debounce(resize, 250));
  resize();
})();
 
 
// ─────────────────────────────────────────────────
// 2. HEADER — efeito ao scrollar
// ─────────────────────────────────────────────────
(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
 
  const update = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
 
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
 
 
// ─────────────────────────────────────────────────
// 3. MENU MOBILE (hambúrguer)
// ─────────────────────────────────────────────────
(function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !navLinks) return;
 
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open', !expanded);
    document.body.style.overflow = !expanded ? 'hidden' : '';
  });
 
  // Fechar ao clicar em link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
 
  // Fechar com ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
})();
 
 
// ─────────────────────────────────────────────────
// 4. REVELAR ELEMENTOS AO SCROLLAR
// ─────────────────────────────────────────────────
(function initReveal() {
  const targets = document.querySelectorAll(
    '.projeto-card, .skill-group, .manifesto__item, .sobre__stats, .stat'
  );
 
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal--delay-1');
    if (i % 3 === 2) el.classList.add('reveal--delay-2');
  });
 
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
 
  targets.forEach(el => io.observe(el));
})();
 
 
// ─────────────────────────────────────────────────
// 5. CONTADORES ANIMADOS (sobre stats)
// ─────────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat__number[data-target]');
  if (!counters.length) return;
 
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
 
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const start = performance.now();
 
      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
 
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
 
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
 
  counters.forEach(el => io.observe(el));
})();
 
 
// ─────────────────────────────────────────────────
// 6. BARRAS DE HABILIDADE ANIMADAS
// ─────────────────────────────────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar__fill[data-width]');
  if (!bars.length) return;
 
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      // Pequeno delay para garantir que a classe reveal já aplicou
      setTimeout(() => {
        bar.style.width = bar.dataset.width + '%';
      }, 200);
      io.unobserve(bar);
    });
  }, { threshold: 0.4 });
 
  bars.forEach(bar => io.observe(bar));
})();
 
 
// ─────────────────────────────────────────────────
// 7. SCROLL SUAVE — nav links (respeita reduced-motion)
// ─────────────────────────────────────────────────
(function initSmoothScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
 
      const target = document.querySelector(id);
      if (!target) return;
 
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start',
      });
 
      // Atualiza o foco para acessibilidade
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    });
  });
})();
 
 
// ─────────────────────────────────────────────────
// 8. LINK ATIVO NA NAVEGAÇÃO (highlight de seção)
// ─────────────────────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;
 
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
 
  sections.forEach(s => io.observe(s));
})();
 
 
// ─────────────────────────────────────────────────
// UTILITÁRIO: debounce
// ─────────────────────────────────────────────────
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
