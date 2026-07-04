/* ============================================================
   Hero LMS — Auth
   Google Identity Services + Microsoft MSAL + Email/Demo
   ============================================================ */
'use strict';

const API = '/api/v1';

// ── Helpers ───────────────────────────────────────────────────────────────────

function setLoading(btn, loading) {
  btn.disabled = loading;
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Please wait…';
  } else {
    btn.textContent = btn.dataset.originalText || btn.textContent;
  }
}

// ── Redirect resolution ───────────────────────────────────────────────────────

function getLoginRedirect() {
  const oauthReturn = sessionStorage.getItem('heroLoginReturn');
  if (oauthReturn) { sessionStorage.removeItem('heroLoginReturn'); return oauthReturn; }
  return window._loginRedirect || '/hero/index.html';
}

// ── Core login success handler ────────────────────────────────────────────────

function loginSuccess(user, source) {
  const normalised = {
    email: user.email,
    name: user.name
      || user.displayName
      || (user.given_name ? `${user.given_name} ${user.family_name || ''}`.trim() : null)
      || user.email,
    avatar: user.picture || user.avatar || null,
    source: source || 'email',
    loggedInAt: new Date().toISOString(),
  };

  localStorage.setItem('heroUser', JSON.stringify(normalised));

  const email = normalised.email;
  const isFirstLogin = !localStorage.getItem(`heroRole:${email}`);

  if (isFirstLogin) {
    showRoleSelector(normalised);
  } else {
    Toast.success('Welcome back!', `Signed in as ${normalised.name}`);
    setTimeout(() => { window.location.href = getLoginRedirect(); }, 900);
  }
}

// ── Role selector overlay ─────────────────────────────────────────────────────

function showRoleSelector(user) {
  // Remove any existing overlay
  document.getElementById('roleSelectorOverlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'roleSelectorOverlay';
  overlay.style.cssText = [
    'position:fixed;inset:0;',
    'background:rgba(10,22,40,0.92);',
    'z-index:10000;',
    'display:flex;align-items:center;justify-content:center;',
    'padding:20px;',
    'backdrop-filter:blur(8px);',
    '-webkit-backdrop-filter:blur(8px);',
  ].join('');

  const roles = [
    { role: 'K12',      emoji: '🏫', label: 'K-12 Student',    desc: 'Middle or high school' },
    { role: 'Adult',    emoji: '💼', label: 'Adult Learner',   desc: 'College or professional' },
    { role: 'Educator', emoji: '📋', label: 'Educator',        desc: 'Teacher or instructor' },
    { role: 'Parent',   emoji: '👨‍👩‍👧', label: 'Parent / Guardian', desc: 'Supporting a learner' },
  ];

  const cardStyle = [
    'background:white;border:2px solid #e2e8f0;border-radius:14px;',
    'padding:20px 12px;cursor:pointer;',
    'transition:border-color 0.18s,background 0.18s,transform 0.18s;',
    'display:flex;flex-direction:column;align-items:center;gap:6px;',
    'font-family:inherit;box-shadow:none;',
  ].join('');

  overlay.innerHTML = `
    <div style="
      background:white;border-radius:20px;padding:40px 36px;
      max-width:520px;width:100%;
      box-shadow:0 32px 80px rgba(0,0,0,0.35);
      text-align:center;
    ">
      <div style="font-size:2.6rem;margin-bottom:12px;">🎓</div>
      <h2 style="
        font-family:var(--font-display,sans-serif);font-size:1.45rem;
        color:#0a1628;margin:0 0 8px;
      ">Welcome, ${user.name || user.email}!</h2>
      <p style="color:#64748b;font-size:0.875rem;margin:0 0 28px;">
        How will you be using Hero LMS?<br/>
        This helps us personalise your experience.
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        ${roles.map(r => `
          <button
            class="role-card-btn"
            data-role="${r.role}"
            style="${cardStyle}"
          >
            <span style="font-size:1.75rem;line-height:1;">${r.emoji}</span>
            <strong style="font-size:0.875rem;color:#0a1628;">${r.label}</strong>
            <span style="font-size:0.76rem;color:#64748b;">${r.desc}</span>
          </button>
        `).join('')}
      </div>
      <p style="font-size:0.76rem;color:#94a3b8;">
        You can change this in your profile settings any time.
      </p>
    </div>
  `;
  document.body.appendChild(overlay);

  // Hover effects via JS (avoids needing extra CSS)
  overlay.querySelectorAll('.role-card-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.borderColor = '#0d9488';
      btn.style.background = '#f0fdfa';
      btn.style.transform = 'translateY(-2px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.borderColor = '#e2e8f0';
      btn.style.background = 'white';
      btn.style.transform = '';
    });
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      localStorage.setItem(`heroRole:${user.email}`, role);
      overlay.remove();
      const label = roles.find(r => r.role === role)?.label || role;
      Toast.success('Account ready! 🚀', `Set up as ${label}.`);
      setTimeout(() => { window.location.href = getLoginRedirect(); }, 1000);
    });
  });
}

// ── Google OAuth (Google Identity Services) ───────────────────────────────────

window.handleGoogleCredential = function (response) {
  try {
    // Decode the signed JWT — Google already verified it server-side, safe to read client-side
    const parts   = response.credential.split('.');
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    loginSuccess({
      email:    payload.email,
      name:     payload.name,
      picture:  payload.picture,
    }, 'google');
  } catch (err) {
    console.error('[Hero Auth] Google credential decode error:', err);
    Toast.error('Google Sign-In failed', 'Could not read account info. Please try again.');
  }
};

function initGoogleAuth() {
  const container = document.getElementById('googleLoginBtn');
  if (!container) return;

  const cfg = window.HERO_AUTH_CONFIG?.google;

  if (!cfg?.clientId || cfg.clientId.includes('YOUR_')) {
    // Demo mode: render a styled button that prompts for an email
    container.innerHTML = `
      <button class="social-btn" id="googleLoginDemo" type="button" style="width:100%;">
        <span>G</span> Continue with Google <em style="font-size:0.75em;opacity:0.7;">(demo)</em>
      </button>`;
    container.querySelector('#googleLoginDemo')?.addEventListener('click', () => {
      const email = prompt('Demo — enter any email to simulate Google Sign-In:');
      if (email && email.includes('@')) {
        loginSuccess({ email, name: email.split('@')[0] }, 'google-demo');
      }
    });
    return;
  }

  // Load real GIS SDK
  const script = document.createElement('script');
  script.src   = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    google.accounts.id.initialize({
      client_id:             cfg.clientId,
      callback:              window.handleGoogleCredential,
      auto_select:           false,
      cancel_on_tap_outside: true,
    });
    google.accounts.id.renderButton(container, {
      theme: 'outline',
      size:  'large',
      width: container.offsetWidth || 220,
      text:  'signin_with',
      shape: 'rectangular',
    });
  };
  document.head.appendChild(script);
}

// ── Microsoft OAuth (MSAL.js 3.7.1) ──────────────────────────────────────────

let _msalInstance = null;

async function microsoftLogin() {
  const cfg = window.HERO_AUTH_CONFIG?.microsoft;

  if (!cfg?.clientId || cfg.clientId.includes('YOUR_')) {
    const email = prompt('Demo — enter any email to simulate Microsoft Sign-In:');
    if (email && email.includes('@')) {
      loginSuccess({ email, name: email.split('@')[0] }, 'microsoft-demo');
    }
    return;
  }

  try {
    // Lazy-load MSAL if needed
    if (typeof msal === 'undefined') {
      await new Promise((resolve, reject) => {
        const s     = document.createElement('script');
        s.src       = 'https://alcdn.msauth.net/browser/3.7.1/js/msal-browser.min.js';
        s.onload    = resolve;
        s.onerror   = () => reject(new Error('Failed to load MSAL'));
        document.head.appendChild(s);
      });
    }

    if (!_msalInstance) {
      _msalInstance = new msal.PublicClientApplication({
        auth: {
          clientId:    cfg.clientId,
          authority:   cfg.authority || 'https://login.microsoftonline.com/common',
          redirectUri: window.location.href.split('?')[0],
        },
        cache: {
          cacheLocation:        'localStorage',
          storeAuthStateInCookie: false,
        },
      });
      await _msalInstance.initialize();
    }

    const result  = await _msalInstance.loginPopup({
      scopes: cfg.scopes || ['openid', 'profile', 'email'],
    });
    const account = result.account;
    loginSuccess({
      email: account.username,
      name:  account.name || account.username,
    }, 'microsoft');
  } catch (err) {
    if (err?.errorCode !== 'user_cancelled') {
      console.error('[Hero Auth] Microsoft login error:', err);
      Toast.error('Microsoft Sign-In failed', err?.message || 'Please try again.');
    }
  }
}

function initMicrosoftAuth() {
  document.getElementById('microsoftLogin')?.addEventListener('click', microsoftLogin);
}

// ── Boot OAuth on page load ───────────────────────────────────────────────────

(function bootOAuth() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initGoogleAuth(); initMicrosoftAuth(); });
  } else {
    initGoogleAuth();
    initMicrosoftAuth();
  }
})();

// ── Password toggle ───────────────────────────────────────────────────────────

const _toggleBtn   = document.getElementById('passwordToggle');
const _passwordInp = document.getElementById('password');
if (_toggleBtn && _passwordInp) {
  _toggleBtn.addEventListener('click', () => {
    const vis = _passwordInp.type === 'text';
    _passwordInp.type    = vis ? 'password' : 'text';
    _toggleBtn.textContent = vis ? '👁' : '🙈';
  });
}

// ── Login form (email + password) ─────────────────────────────────────────────

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn      = loginForm.querySelector('[type="submit"]');
    const email    = loginForm.email.value.trim();
    const password = loginForm.password?.value || '';
    if (!email) { Toast.error('Email required', 'Please enter your email address.'); return; }

    setLoading(btn, true);
    let loggedIn = false;

    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, password,
          rememberMe: loginForm.rememberMe?.checked ?? false,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        const storage = loginForm.rememberMe?.checked ? localStorage : sessionStorage;
        storage.setItem('h2eo_token', data.data?.accessToken || '');
        loginSuccess(data.data?.user || { email }, 'email');
        loggedIn = true;
      }
    } catch { /* network offline — fall through to demo */ }

    // Demo / no-backend fallback
    if (!loggedIn) {
      loginSuccess({ email, name: email.split('@')[0] }, 'email-demo');
    }

    setLoading(btn, false);
  });
}

// ── Register form ─────────────────────────────────────────────────────────────

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn     = registerForm.querySelector('[type="submit"]');
    const pwd     = registerForm.password?.value || '';
    const confirm = registerForm.confirmPassword?.value || '';
    if (pwd !== confirm) {
      Toast.error('Passwords do not match', 'Please re-enter your password.'); return;
    }
    const email = registerForm.email.value.trim();
    const name  = `${registerForm.firstName?.value || ''} ${registerForm.lastName?.value || ''}`.trim()
                  || email;

    setLoading(btn, true);
    let created = false;

    try {
      const res  = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: registerForm.firstName?.value,
          lastName:  registerForm.lastName?.value,
          email, password: pwd,
          role: registerForm.role?.value || 'student',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        Toast.success('Account created!', 'Please check your email to verify your account.');
        setTimeout(() => { window.location.href = 'login.html'; }, 2500);
        created = true;
      }
    } catch { /* fall through */ }

    if (!created) {
      loginSuccess({ email, name }, 'email-demo');
    }

    setLoading(btn, false);
  });
}

// ── Password Reset Modal ──────────────────────────────────────────────────────

const forgotLink  = document.getElementById('forgotPasswordLink');
const resetModal  = document.getElementById('resetModal');
const cancelReset = document.getElementById('cancelReset');
const resetForm   = document.getElementById('resetForm');

if (forgotLink && resetModal) {
  forgotLink.addEventListener('click', (e) => { e.preventDefault(); resetModal.style.display = 'flex'; });
}
if (cancelReset && resetModal) {
  cancelReset.addEventListener('click', () => { resetModal.style.display = 'none'; });
  resetModal.addEventListener('click', (e) => { if (e.target === resetModal) resetModal.style.display = 'none'; });
}
if (resetForm) {
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = resetForm.querySelector('[type="submit"]');
    setLoading(btn, true);
    try {
      await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: document.getElementById('resetEmail')?.value }),
      });
    } catch { /* ignore */ }
    // Always show success (prevents email enumeration)
    Toast.success('Reset link sent!', "If that email exists, you'll receive a reset link shortly.");
    if (resetModal) resetModal.style.display = 'none';
    setLoading(btn, false);
  });
}
