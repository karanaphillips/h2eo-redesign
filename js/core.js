/* H2EO Core JavaScript — shared across all pages */

'use strict';

// ── Toast Notifications ──────────────────────────────────────────────────────

const Toast = (() => {
  let container = null;

  function getContainer() {
    if (!container) {
      container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
      }
    }
    return container;
  }

  const icons = {
    success: '✓',
    error:   '✕',
    info:    'ℹ',
    warning: '⚠',
  };

  function show(type, title, message = '', duration = 4500) {
    const c = getContainer();
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.setAttribute('role', 'alert');
    el.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Dismiss">×</button>
    `;
    el.querySelector('.toast-close').addEventListener('click', () => dismiss(el));
    c.appendChild(el);

    if (duration > 0) {
      setTimeout(() => dismiss(el), duration);
    }
    return el;
  }

  function dismiss(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('toast-exit');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  return {
    success: (title, msg, dur) => show('success', title, msg, dur),
    error:   (title, msg, dur) => show('error',   title, msg, dur),
    info:    (title, msg, dur) => show('info',    title, msg, dur),
    warning: (title, msg, dur) => show('warning', title, msg, dur),
  };
})();

window.Toast = Toast;


// ── Scroll Reveal ─────────────────────────────────────────────────────────────

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length || !('IntersectionObserver' in window)) {
    // Fallback: show everything
    els.forEach(el => el.classList.add('in-view'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}


// ── Sticky Nav ────────────────────────────────────────────────────────────────

function initNav() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  const hamburger = nav.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}


// ── Smooth scroll for anchor links ────────────────────────────────────────────

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}


// ── Trademark normalizer ──────────────────────────────────────────────────────

function normalizeTM() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) {
    if (n.nodeValue && n.nodeValue.includes('™') && !n.parentElement.closest('sup.tm')) {
      nodes.push(n);
    }
  }
  nodes.forEach(node => {
    const parts = node.nodeValue.split('™');
    if (parts.length < 2) return;
    const frag = document.createDocumentFragment();
    parts.forEach((part, i) => {
      if (part) frag.appendChild(document.createTextNode(part));
      if (i < parts.length - 1) {
        const sup = document.createElement('sup');
        sup.className = 'tm';
        sup.textContent = '™';
        frag.appendChild(sup);
      }
    });
    node.parentNode.replaceChild(frag, node);
  });
}


// ── Active nav link ───────────────────────────────────────────────────────────

function markActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop().split('?')[0];
    a.classList.toggle('active', href === path);
  });
}


// ── Counter animation ─────────────────────────────────────────────────────────

function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1600;
      const start = performance.now();
      const isFloat = target % 1 !== 0;

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}


// ── Contact form with toast ────────────────────────────────────────────────────

function initContactForms() {
  document.querySelectorAll('[data-contact-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      try {
        const fd = new FormData(form);
        const body = {};
        fd.forEach((v, k) => { body[k] = v; });
        body.newsletter = form.querySelector('[name="newsletter"]')?.checked ?? false;

        const res = await fetch('/api/v1/contact/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          Toast.success('Message sent!', 'We\'ll be in touch within 1–2 business days.');
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        Toast.error('Unable to send', 'Please try again or email us directly.');
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  });
}


// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('ready');
  initNav();
  initScrollReveal();
  initSmoothScroll();
  normalizeTM();
  markActiveNavLink();
  animateCounters();
  initContactForms();
});
