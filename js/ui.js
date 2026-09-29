// ============================================================
// Визуальные эффекты и мелкие UI-утилиты.
// Всё уважает prefers-reduced-motion и работает без зависимостей.
// ============================================================
// Обычный (не модульный) скрипт: работает и с хостинга, и при открытии index.html двойным кликом.
(function (SM) {
'use strict';

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const reducedMotion = () => motionQuery.matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// ---------- иконки ----------

const icon = (id, cls = 'icon') =>
  `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${id}"></use></svg>`;

// ---------- View Transitions с фолбэком ----------

function withTransition(update) {
  if (!document.startViewTransition || reducedMotion()) {
    update();
    return;
  }
  document.startViewTransition(update);
}

// ---------- перезапуск CSS-анимации ----------

function replay(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth; // принудительный reflow, чтобы анимация проигралась снова
  el.classList.add(cls);
  el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
}

// ---------- тосты ----------

const TOAST_ICONS = { ok: 'check', copy: 'copy', viber: 'viber', error: 'info' };

function toast(message, { type = 'ok', timeout = 3600 } = {}) {
  const host = $('dialog[open] .toast-host') || $('#toasts');
  if (!host) return;
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.setAttribute('role', 'status');
  el.innerHTML = `<span class="toast__icon">${icon(TOAST_ICONS[type] || 'check', 'icon icon--sm')}</span><span></span>`;
  el.lastElementChild.textContent = message;
  host.append(el);
  while (host.children.length > 3) host.firstElementChild.remove();
  setTimeout(() => {
    el.classList.add('is-leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 600);
  }, timeout);
}

// ---------- буфер обмена ----------

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* упадём в запасной способ */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0;inset:0 auto auto 0';
    ($('dialog[open]') || document.body).append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

// ---------- шапка: «стекло» при прокрутке + подсветка активного раздела ----------

function initHeader() {
  const header = $('.site-header');
  if (!header) return;

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const links = $$('.nav__link[href^="#"]');
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  // Секции без пункта меню (hero, «Как заказать», финальный CTA) тоже отслеживаются —
  // на них подсветка снимается или остаётся у ближайшего раздела выше.
  const sections = [...document.querySelectorAll('main > section[id]')];
  if (!('IntersectionObserver' in window) || !sections.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      if (id === 'top') links.forEach((a) => a.removeAttribute('aria-current'));
      if (!map.has(id)) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      map.get(id).setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => io.observe(s));
}

// ---------- появление при прокрутке ----------

let revealObserver;

function initReveal() {
  const els = $$('.reveal');
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((el) => revealObserver.observe(el));
}

// ---------- анимированные счётчики ----------

function initCounters() {
  const els = $$('[data-count-to]');
  const render = (el, value) => {
    el.textContent = `${Math.round(value)}${el.dataset.countSuffix || ''}`;
  };
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    els.forEach((el) => render(el, Number(el.dataset.countTo)));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const el = entry.target;
      const from = Number(el.dataset.countFrom || 0);
      const to = Number(el.dataset.countTo);
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        render(el, from + (to - from) * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  els.forEach((el) => { render(el, Number(el.dataset.countFrom || 0)); io.observe(el); });
}

// ---------- заголовок hero: разбивка на слова ----------

function splitWords(el) {
  if (!el) return;
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
          const span = document.createElement('span');
          span.className = 'w';
          span.style.setProperty('--i', i++);
          span.textContent = part;
          frag.append(span);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
}

// ---------- искры и угольки на canvas ----------

function initSparks(canvas) {
  if (!canvas || reducedMotion()) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const host = canvas.parentElement;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const MAX = window.innerWidth < 768 ? 28 : 55;
  let w = 0, h = 0, raf = 0, running = false, visible = true;
  const parts = [];

  const resize = () => {
    const r = host.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  // Искры рождаются у «жаровни» — под картинкой справа (на мобильных — по центру снизу)
  const spawn = () => {
    const mobile = w < 900;
    const cx = mobile ? w * 0.5 : w * 0.7;
    const cy = mobile ? h * 0.82 : h * 0.72;
    const spread = mobile ? w * 0.35 : w * 0.2;
    return {
      x: cx + (Math.random() - 0.5) * spread * 2,
      y: cy + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.45 + Math.random() * 1.1),
      r: 0.6 + Math.random() * 1.9,
      life: 0,
      max: 140 + Math.random() * 200,
      sway: Math.random() * Math.PI * 2,
    };
  };

  const frame = () => {
    ctx.clearRect(0, 0, w, h);
    if (parts.length < MAX && Math.random() < 0.55) parts.push(spawn());
    ctx.globalCompositeOperation = 'lighter';
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life++;
      p.sway += 0.03;
      p.x += p.vx + Math.sin(p.sway) * 0.35;
      p.y += p.vy;
      const t = p.life / p.max;
      if (t >= 1 || p.y < -10) { parts.splice(i, 1); continue; }
      const alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `rgba(255, 226, 170, ${alpha})`);
      g.addColorStop(0.35, `rgba(255, 138, 61, ${alpha * 0.8})`);
      g.addColorStop(1, 'rgba(226, 54, 28, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  };

  const start = () => { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  resize();
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(host);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  motionQuery.addEventListener('change', () => { if (reducedMotion()) { stop(); ctx.clearRect(0, 0, w, h); } else start(); });
  start();
}

// ---------- параллакс hero (мышь + прокрутка) ----------

function initParallax() {
  const visual = $('.hero__visual');
  if (!visual || reducedMotion()) return;
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;

  const loop = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    visual.style.setProperty('--px', `${cx.toFixed(2)}px`);
    visual.style.setProperty('--py', `${cy.toFixed(2)}px`);
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.1 ? requestAnimationFrame(loop) : 0;
  };
  if (finePointer()) {
    window.addEventListener('pointermove', (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * -22;
      ty = (e.clientY / window.innerHeight - 0.5) * -16;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  }
  let sraf = 0;
  window.addEventListener('scroll', () => {
    if (sraf) return;
    sraf = requestAnimationFrame(() => {
      sraf = 0;
      if (window.scrollY < window.innerHeight * 1.2) visual.style.setProperty('--sy', `${(window.scrollY * 0.12).toFixed(1)}px`);
    });
  }, { passive: true });
}

// ---------- «фитиль» таймлайна процесса ----------

function initFuse() {
  const section = $('.process');
  const list = $('.steps');
  if (!section || !list) return;
  const steps = $$('.step', list);

  const update = () => {
    const r = list.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = reducedMotion() ? 1 : clamp((vh * 0.72 - r.top) / (r.height + vh * 0.1), 0, 1);
    section.style.setProperty('--progress', p.toFixed(3));
    steps.forEach((step, i) => step.classList.toggle('is-lit', p >= (i / Math.max(steps.length - 1, 1)) - 0.02));
  };
  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

// ---------- 3D-наклон карточек (только точный указатель) ----------

function initTilt(els) {
  if (!finePointer() || reducedMotion()) return;
  els.forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add('is-tilting');
      el.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(y * -6).toFixed(2)}deg`);
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-tilting');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
}

// ---------- «магнитные» кнопки ----------

function initMagnetic() {
  if (!finePointer() || reducedMotion()) return;
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.setProperty('--mx', `${clamp(x * 0.22, -10, 10).toFixed(1)}px`);
      el.style.setProperty('--my', `${clamp(y * 0.3, -8, 8).toFixed(1)}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  });
}

// ---------- угольки в финальном баннере (CSS-анимация, JS только расставляет) ----------

function initEmbers() {
  const host = $('.embers');
  if (!host || reducedMotion()) return;
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    s.style.setProperty('--x', `${Math.round(Math.random() * 100)}%`);
    s.style.setProperty('--t', `${(5 + Math.random() * 5).toFixed(1)}s`);
    s.style.setProperty('--delay', `${(Math.random() * -8).toFixed(1)}s`);
    s.style.setProperty('--dx', `${Math.round((Math.random() - 0.5) * 120)}px`);
    host.append(s);
  }
}

// ---------- «полёт» миниатюры в корзину ----------

/** target — точка {x, y} во вьюпорте (кнопка корзины может ещё выезжать). */
function flyToCart(sourceEl, target, done) {
  if (!sourceEl || !target || reducedMotion() || !Element.prototype.animate) { done?.(); return; }
  const s = sourceEl.getBoundingClientRect();
  const t = { left: target.x, top: target.y, width: 0, height: 0 };
  const size = Math.min(s.width, s.height, 140);
  const fly = document.createElement('div');
  fly.className = 'fly';
  fly.style.cssText = `inline-size:${size}px;block-size:${size}px;left:${s.left + s.width / 2 - size / 2}px;top:${s.top + s.height / 2 - size / 2}px`;
  const img = sourceEl.querySelector('img');
  if (img) {
    const clone = document.createElement('img');
    clone.src = img.currentSrc || img.src;
    clone.alt = '';
    fly.append(clone);
  } else {
    fly.innerHTML = icon('flame');
  }
  document.body.append(fly);
  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);
  const anim = fly.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.55}px, ${dy * 0.35 - 80}px) scale(0.6)`, opacity: 0.95, offset: 0.55 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.15)`, opacity: 0.4 },
  ], { duration: 750, easing: 'cubic-bezier(.5,0,.3,1)' });
  anim.onfinish = () => { fly.remove(); done?.(); };
}

// ---------- мобильное меню (<dialog>: фокус-ловушка и Esc — нативно) ----------

function initMobileNav() {
  const dlg = $('#mnav');
  const openBtn = $('[data-open-mnav]');
  if (!dlg || !openBtn) return;
  const close = () => { dlg.close(); openBtn.setAttribute('aria-expanded', 'false'); };
  openBtn.addEventListener('click', () => { dlg.showModal(); openBtn.setAttribute('aria-expanded', 'true'); });
  dlg.addEventListener('close', () => openBtn.setAttribute('aria-expanded', 'false'));
  dlg.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) close();
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      e.preventDefault();
      close();
      document.querySelector(link.getAttribute('href'))?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
    }
  });
}

SM.ui = { reducedMotion, finePointer, icon, withTransition, replay, toast, copyText, initHeader, initReveal, initCounters, splitWords, initSparks, initParallax, initFuse, initTilt, initMagnetic, initEmbers, flyToCart, initMobileNav };
})(window.ShishMish = window.ShishMish || {});
