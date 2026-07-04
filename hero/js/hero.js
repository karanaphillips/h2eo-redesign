// Hero LMS — dashboard controller
(function () {

  // ─── Storage helpers ──────────────────────────────────────────────────────
  const storage = {
    getCurrent: () => JSON.parse(localStorage.getItem('heroUser') || 'null'),
    setCurrent: (user) => localStorage.setItem('heroUser', JSON.stringify(user)),
    clearCurrent: () => localStorage.removeItem('heroUser'),
  };

  // ─── Role helpers ─────────────────────────────────────────────────────────
  const roles = {
    list: ['Educator', 'Adult', 'Parent', 'K12'],
    get: (email) => localStorage.getItem(`heroRole:${email}`) || 'Adult',
    set: (email, role) => {
      if (roles.list.includes(role)) localStorage.setItem(`heroRole:${email}`, role);
    }
  };

  // ─── API fetch with token refresh ─────────────────────────────────────────
  async function apiFetch(url, options = {}) {
    const headers = Object.assign({ 'Accept': 'application/json' }, options.headers || {});
    const token = localStorage.getItem('heroToken');
    if (token) headers.Authorization = `Bearer ${token}`;
    let resp = await fetch(url, Object.assign({}, options, { headers }));
    if (resp.status !== 401) return resp;
    try {
      const refreshToken = localStorage.getItem('heroRefreshToken');
      if (!refreshToken) return resp;
      const refreshResp = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      if (!refreshResp.ok) return resp;
      const json = await refreshResp.json();
      const tokens = json?.data?.tokens;
      if (!tokens?.accessToken) return resp;
      localStorage.setItem('heroToken', tokens.accessToken);
      localStorage.setItem('heroRefreshToken', tokens.refreshToken);
      headers.Authorization = `Bearer ${tokens.accessToken}`;
      resp = await fetch(url, Object.assign({}, options, { headers }));
    } catch {}
    return resp;
  }

  // ─── Auth gate ────────────────────────────────────────────────────────────
  function requireAuth() {
    const user = storage.getCurrent();
    if (!user) {
      window.location.href = '/hero/login.html';
      return false;
    }

    // Populate topbar
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) userDisplay.textContent = user.name || user.email || '';

    // Resolve role from JWT or stored value
    let role = roles.get(user.email);
    try {
      const token = localStorage.getItem('heroToken');
      if (token && token.includes('.')) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role) {
          if (['instructor', 'admin', 'super_admin'].includes(payload.role)) role = 'Educator';
          else if (payload.role === 'student') role = role || 'K12';
          roles.set(user.email, role);
        }
      }
    } catch {}

    const roleBadge = document.getElementById('roleBadge');
    if (roleBadge) roleBadge.textContent = role || 'Learner';

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try { await apiFetch('/api/v1/auth/logout', { method: 'POST' }); } catch {}
        storage.clearCurrent();
        localStorage.removeItem('heroToken');
        localStorage.removeItem('heroRefreshToken');
        window.location.href = '/hero/login.html';
      });
    }

    return true;
  }

  // ─── Hero section user display ────────────────────────────────────────────
  function initHeroDisplay() {
    const user = storage.getCurrent();
    if (!user) return;

    const avatar = document.getElementById('heroAvatar');
    const name = document.getElementById('heroUserName');
    const spBadge = document.getElementById('heroSpBadge');

    const displayName = user.name || user.email || '';
    const nameParts = displayName.split(' ');
    const initials = nameParts.map(p => p[0] || '').join('').slice(0, 2).toUpperCase();
    if (avatar) avatar.textContent = initials || '?';
    if (name) name.textContent = displayName;

    // Show superpower if assessment is done
    if (spBadge) {
      try {
        const raw = localStorage.getItem(`heroAssessment:${user.email}`);
        if (raw) {
          const data = JSON.parse(raw);
          spBadge.textContent = data.name ? `Academic Superpower™: ${data.name}` : 'Academic Superpowers™ assessed';
        }
      } catch {}
    }
  }

  // ─── Panel helper ─────────────────────────────────────────────────────────
  let $panel = null;

  function renderPanel(html) {
    if ($panel) $panel.innerHTML = html;
  }

  function setActiveNav(activeId) {
    document.querySelectorAll('.sidebar-link[id]').forEach(el => el.classList.remove('active'));
    const el = document.getElementById(activeId);
    if (el) el.classList.add('active');
    // Also deactivate the main Dashboard link
    const dashLink = document.querySelector('.sidebar-link[href="index.html"]');
    if (dashLink) dashLink.classList.remove('active');
  }

  // ─── Panel: Assessment ────────────────────────────────────────────────────
  function showAssessment() {
    setActiveNav('navAssessment');
    const user = storage.getCurrent();
    if (!user) {
      renderPanel(emptyState('⚡', 'Assessment', 'Sign in to view your Academic Superpowers™ assessment.'));
      return;
    }

    try {
      const raw = localStorage.getItem(`heroAssessment:${user.email}`);
      if (!raw) {
        renderPanel(`
          <div class="panel-content">
            <div style="text-align:center;padding:var(--space-10) var(--space-8);">
              <div style="font-size:3rem;margin-bottom:var(--space-4);">⚡</div>
              <h3 style="margin-bottom:var(--space-3);">No Assessment on File</h3>
              <p style="color:var(--text-muted);margin-bottom:var(--space-8);max-width:420px;margin-left:auto;margin-right:auto;">
                You haven't completed your Academic Superpowers™ assessment yet. Discover your unique learning archetype to personalize your experience.
              </p>
              <a href="/profile.html" class="btn btn-primary btn-lg">Take the Assessment</a>
            </div>
          </div>`);
        return;
      }

      const data = JSON.parse(raw);
      const imgSrc = data.image ? `../${data.image}` : '';
      const completedDate = data.completedAt ? new Date(data.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

      renderPanel(`
        <div class="panel-content">
          <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-8);">
            <span class="eyebrow">My Assessment</span>
          </div>
          <div style="display:flex;align-items:flex-start;gap:var(--space-6);flex-wrap:wrap;padding:var(--space-6);background:var(--surface-off);border-radius:var(--radius-xl);margin-bottom:var(--space-6);">
            ${imgSrc ? `<img src="${imgSrc}" alt="${data.name}" style="width:80px;height:80px;border-radius:var(--radius-lg);flex-shrink:0;">` : `<div style="width:80px;height:80px;background:var(--surface-teal-tint);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;font-size:2.5rem;flex-shrink:0;">⚡</div>`}
            <div style="flex:1;min-width:200px;">
              <h3 style="margin-bottom:var(--space-2);">${data.name || 'Your Superpower'}</h3>
              ${data.motto ? `<p style="font-style:italic;color:var(--text-secondary);margin-bottom:var(--space-3);">"${data.motto}"</p>` : ''}
              <span class="badge badge-teal">Completed ${completedDate}</span>
            </div>
          </div>
          ${data.description ? `<p style="color:var(--text-secondary);line-height:1.7;margin-bottom:var(--space-6);">${data.description}</p>` : ''}
          <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;">
            <a href="/results.html" class="btn btn-primary">View Full Results</a>
            <a href="/profile.html" class="btn btn-secondary">Retake Assessment</a>
          </div>
        </div>`);
    } catch {
      renderPanel(errorState('Assessment', "We couldn't load your assessment data."));
    }
  }

  // ─── Panel: Full Profile ──────────────────────────────────────────────────
  function showFullProfile() {
    setActiveNav('navProfile');
    const user = storage.getCurrent();
    if (!user) {
      renderPanel(emptyState('👤', 'Profile', 'Sign in to view your learner profile.'));
      return;
    }

    try {
      const raw = localStorage.getItem(`heroAssessment:${user.email}`);
      const role = roles.get(user.email);
      const avatarInitials = ((user.firstName || '')[0] || '') + ((user.lastName || '')[0] || '');

      const assessmentBlock = raw ? (() => {
        const data = JSON.parse(raw);
        const imgSrc = data.image ? `../${data.image}` : '';
        return `
          <div style="background:var(--surface-teal-tint);border-radius:var(--radius-xl);padding:var(--space-6);margin-bottom:var(--space-6);">
            <div style="font-size:var(--text-xs);font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--h2eo-teal);margin-bottom:var(--space-3);">Academic Superpowers™</div>
            <div style="display:flex;align-items:center;gap:var(--space-4);">
              ${imgSrc ? `<img src="${imgSrc}" alt="${data.name}" style="width:56px;height:56px;border-radius:var(--radius-md);">` : '<div style="width:56px;height:56px;background:rgba(13,148,136,0.2);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:1.75rem;">⚡</div>'}
              <div>
                <div style="font-weight:700;font-size:var(--text-lg);">${data.name || '—'}</div>
                ${data.motto ? `<div style="font-style:italic;color:var(--text-secondary);font-size:var(--text-sm);">"${data.motto}"</div>` : ''}
              </div>
            </div>
          </div>`;
      })() : `
        <div style="background:var(--surface-off);border-radius:var(--radius-xl);padding:var(--space-6);margin-bottom:var(--space-6);text-align:center;">
          <p style="color:var(--text-muted);margin-bottom:var(--space-4);">No assessment on file yet.</p>
          <a href="/profile.html" class="btn btn-primary btn-sm">Take the Assessment</a>
        </div>`;

      renderPanel(`
        <div class="panel-content">
          <span class="eyebrow" style="display:block;margin-bottom:var(--space-6);">Learner Profile</span>
          <div style="display:flex;align-items:center;gap:var(--space-5);margin-bottom:var(--space-8);padding-bottom:var(--space-8);border-bottom:1px solid var(--border-subtle);">
            <div style="width:72px;height:72px;background:linear-gradient(135deg,var(--h2eo-navy),var(--h2eo-blue));border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;color:white;font-size:var(--text-2xl);flex-shrink:0;">${avatarInitials.toUpperCase() || '?'}</div>
            <div>
              <h3 style="margin-bottom:var(--space-1);">${user.firstName} ${user.lastName}</h3>
              <p style="color:var(--text-muted);font-size:var(--text-sm);">${user.email}</p>
              <span class="badge badge-blue" style="margin-top:var(--space-2);">${role}</span>
            </div>
          </div>
          ${assessmentBlock}
          <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;margin-top:var(--space-2);">
            <a href="/results.html" class="btn btn-primary">View Full Results</a>
            <button class="btn btn-secondary" id="profileAssessmentBtn">Retake Assessment</button>
          </div>
        </div>`);

      const retakeBtn = document.getElementById('profileAssessmentBtn');
      if (retakeBtn) retakeBtn.addEventListener('click', () => { window.location.href = '../profile.html'; });
    } catch {
      renderPanel(errorState('Profile', "We couldn't load your profile right now."));
    }
  }

  // ─── Archetype helpers (dashboard-level, no course-data.js dependency) ──
  const ARCHETYPE_INFO = {
    strategicArchitect: { name: 'Strategic Architect', emoji: '🏛️' },
    precisionOperator:  { name: 'Precision Operator',  emoji: '🎯' },
    visionIntegrator:   { name: 'Vision Integrator',   emoji: '🔭' },
    appliedExecutor:    { name: 'Applied Executor',     emoji: '⚡' },
  };
  const ARCHETYPE_LEGACY = {
    mastermind: 'strategicArchitect', brainiac: 'precisionOperator',
    crusader: 'visionIntegrator', hero: 'appliedExecutor',
  };
  const HERO_MODULE_IDS = [
    'reading-intelligence','note-taking-mastery','lecture-video-learning',
    'memory-retention','focus-time-management','test-taking-systems',
    'project-problem-solving','confidence-discipline',
  ];

  function getLocalArchetype(email) {
    try {
      const raw = localStorage.getItem(`heroAssessment:${email}`);
      if (!raw) return null;
      const data = JSON.parse(raw);
      const key = data.superpower || data.type || data.key || null;
      const resolved = key && (ARCHETYPE_INFO[key] ? key : ARCHETYPE_LEGACY[key]);
      if (resolved) return resolved;
      // Try resolving by name
      const name = data.name || '';
      for (const [k, v] of Object.entries(ARCHETYPE_LEGACY)) {
        if (name.toLowerCase().includes(k)) return v;
      }
      return null;
    } catch { return null; }
  }

  function getLocalCourseProgress(email) {
    const total = HERO_MODULE_IDS.length;
    let completed = 0;
    HERO_MODULE_IDS.forEach(id => {
      try {
        const raw = localStorage.getItem(`heroProgress:${email}:activate-superpowers:${id}`);
        if (raw && JSON.parse(raw).completed) completed++;
      } catch {}
    });
    return { completed, total, percent: Math.round((completed / total) * 100) };
  }

  // ─── Panel: Course Catalog ────────────────────────────────────────────────
  async function showCourses() {
    setActiveNav('navCourses');
    renderPanel(loadingState('Loading course catalog…'));

    const user = storage.getCurrent();
    const archetypeKey = user ? getLocalArchetype(user.email) : null;
    const archetypeInfo = archetypeKey ? ARCHETYPE_INFO[archetypeKey] : null;
    const courseProgress = user ? getLocalCourseProgress(user.email) : { completed: 0, total: 8, percent: 0 };

    // ── Flagship course card ──
    const flagshipCard = `
      <div style="background:linear-gradient(135deg,var(--h2eo-navy),#0f2d52);border-radius:var(--radius-2xl);padding:var(--space-8);margin-bottom:var(--space-6);position:relative;overflow:hidden;">
        <div style="position:absolute;width:250px;height:250px;background:radial-gradient(circle,rgba(13,148,136,0.3),transparent 70%);border-radius:50%;filter:blur(60px);top:-60px;right:-30px;pointer-events:none;"></div>
        <div style="position:relative;z-index:1;">
          <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);">
            <span style="background:var(--h2eo-teal);color:white;padding:var(--space-1) var(--space-3);border-radius:var(--radius-full);font-size:var(--text-xs);font-weight:700;">Flagship Course</span>
            ${archetypeInfo ? `<span style="background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.9);padding:var(--space-1) var(--space-3);border-radius:var(--radius-full);font-size:var(--text-xs);font-weight:600;">${archetypeInfo.emoji} ${archetypeInfo.name} Track</span>` : ''}
          </div>
          <h3 style="color:white;margin-bottom:var(--space-2);">⚡ Activate Your Superpowers™</h3>
          <p style="color:rgba(255,255,255,0.72);font-size:var(--text-sm);line-height:1.65;margin-bottom:var(--space-5);">8 modules covering reading, note-taking, memory, time management, test-taking, project execution, and confidence — personalized to your Academic Superpower archetype.</p>
          ${courseProgress.completed > 0 ? `
            <div style="margin-bottom:var(--space-5);">
              <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);">
                <span style="color:rgba(255,255,255,0.6);font-size:var(--text-xs);">Your progress</span>
                <span style="color:white;font-size:var(--text-xs);font-weight:700;">${courseProgress.completed}/8 modules</span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.15);border-radius:99px;overflow:hidden;">
                <div style="width:${courseProgress.percent}%;height:100%;background:var(--h2eo-teal);border-radius:99px;transition:width 0.8s;"></div>
              </div>
            </div>` : ''}
          <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;">
            <a href="/hero/courses/activate-superpowers/index.html" class="btn btn-primary btn-sm">View Course</a>
            <a href="/hero/courses/activate-superpowers/module.html?m=${Math.max(1, courseProgress.completed + 1)}" class="btn btn-outline-white btn-sm">${courseProgress.completed > 0 ? 'Continue Learning' : 'Start Module 1'}</a>
          </div>
        </div>
      </div>`;

    // ── Additional courses (API or mock) ──
    const mockCatalog = [
      { id: '2', title: 'Advanced Problem Solving', description: 'Deep-dive into analytical thinking, logical frameworks, and complex problem decomposition.', instructor: { name: 'H2EO Faculty' }, progress: 0, tags: ['Logic', 'Analysis'], comingSoon: true },
      { id: '3', title: 'AI-Assisted Learning', description: 'Use AI tools ethically and effectively to accelerate your learning without losing your cognitive edge.', instructor: { name: 'H2EO Faculty' }, progress: 0, tags: ['AI', 'Technology'], comingSoon: true },
      { id: '4', title: 'Career & Strengths Alignment', description: 'Connect your Academic Superpowers to career pathways, professional development, and lifelong growth.', instructor: { name: 'H2EO Faculty' }, progress: 0, tags: ['Career', 'Identity'], comingSoon: true },
    ];

    let extraCourses = mockCatalog;
    try {
      const resp = await apiFetch('/api/v1/courses/catalog');
      if (resp && resp.ok) {
        const json = await resp.json();
        if (json?.success && Array.isArray(json?.data?.courses) && json.data.courses.length > 0) {
          extraCourses = json.data.courses;
        }
      }
    } catch {}

    const role = user ? roles.get(user.email) : null;
    const extraCards = extraCourses.map(c => courseCard(c, role, 'catalog')).join('');

    renderPanel(`
      <div class="panel-content">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);">
          <div>
            <span class="eyebrow" style="display:block;margin-bottom:var(--space-1);">Hero Academy</span>
            <h3 style="margin:0;">Course Catalog</h3>
          </div>
        </div>
        ${flagshipCard}
        <div style="margin-bottom:var(--space-4);">
          <span class="eyebrow" style="display:block;margin-bottom:var(--space-2);">Coming Soon</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-4);">${extraCards}</div>
      </div>`);

    wireCourseActions();
  }

  // ─── Panel: Enrolled Courses ──────────────────────────────────────────────
  async function showEnrolledCourses() {
    setActiveNav('navEnrolled');
    const user = storage.getCurrent();

    if (!user) {
      renderPanel(emptyState('🎓', 'My Courses', 'Sign in to view your enrolled courses.'));
      return;
    }

    const hasAssessment = !!localStorage.getItem(`heroAssessment:${user.email}`);
    const courseProgress = getLocalCourseProgress(user.email);
    const archetypeKey = getLocalArchetype(user.email);
    const archetypeInfo = archetypeKey ? ARCHETYPE_INFO[archetypeKey] : null;

    // Find next incomplete module
    let nextModuleNum = 1;
    for (let i = 1; i <= 8; i++) {
      try {
        const raw = localStorage.getItem(`heroProgress:${user.email}:activate-superpowers:${HERO_MODULE_IDS[i-1]}`);
        if (!raw || !JSON.parse(raw).completed) { nextModuleNum = i; break; }
        if (i === 8) nextModuleNum = 1; // all done, restart
      } catch { nextModuleNum = i; break; }
    }

    const flagshipSection = `
      <div style="background:var(--surface-off);border-radius:var(--radius-2xl);border:1.5px solid var(--border-subtle);overflow:hidden;margin-bottom:var(--space-6);">
        <div style="background:linear-gradient(135deg,var(--h2eo-navy),#0f2d52);padding:var(--space-6) var(--space-7);position:relative;overflow:hidden;">
          <div style="position:absolute;width:200px;height:200px;background:radial-gradient(circle,rgba(13,148,136,0.3),transparent 70%);border-radius:50%;filter:blur(50px);top:-50px;right:-20px;pointer-events:none;"></div>
          <div style="position:relative;z-index:1;display:flex;align-items:center;gap:var(--space-4);">
            <div style="font-size:2rem;">⚡</div>
            <div style="flex:1;">
              <div style="color:rgba(255,255,255,0.6);font-size:var(--text-xs);font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Hero Academy — Flagship</div>
              <h4 style="color:white;margin:var(--space-1) 0 0;">Activate Your Superpowers™</h4>
            </div>
            ${courseProgress.completed > 0 ? `<span style="background:var(--h2eo-teal);color:white;padding:var(--space-1) var(--space-3);border-radius:var(--radius-full);font-size:var(--text-xs);font-weight:700;">${courseProgress.completed}/8</span>` : ''}
          </div>
        </div>
        <div style="padding:var(--space-5) var(--space-7);">
          ${archetypeInfo ? `<div style="margin-bottom:var(--space-4);"><span style="font-size:var(--text-sm);color:var(--text-secondary);">Personalized track: </span><strong>${archetypeInfo.emoji} ${archetypeInfo.name}</strong></div>` : ''}
          ${courseProgress.completed > 0 ? `
            <div style="margin-bottom:var(--space-5);">
              <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);font-size:var(--text-xs);">
                <span style="color:var(--text-muted);">Course progress</span>
                <span style="font-weight:700;">${courseProgress.percent}% complete</span>
              </div>
              <div style="height:8px;background:var(--gray-100);border-radius:99px;overflow:hidden;">
                <div style="width:${courseProgress.percent}%;height:100%;background:var(--h2eo-teal);border-radius:99px;"></div>
              </div>
            </div>` : `<p style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--space-4);">8 modules • ~12 hours • Archetype-personalized content</p>`}
          <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;">
            <a href="/hero/courses/activate-superpowers/module.html?m=${nextModuleNum}" class="btn btn-primary btn-sm">${courseProgress.completed > 0 ? `Continue — Module ${nextModuleNum}` : 'Start Now'}</a>
            <a href="/hero/courses/activate-superpowers/index.html" class="btn btn-secondary btn-sm">View All Modules</a>
          </div>
        </div>
      </div>`;

    const noAssessmentBanner = !hasAssessment ? `
      <div style="background:rgba(212,168,67,0.08);border:1.5px solid rgba(212,168,67,0.25);border-radius:var(--radius-xl);padding:var(--space-4) var(--space-5);margin-bottom:var(--space-5);display:flex;align-items:center;gap:var(--space-4);">
        <span style="font-size:1.25rem;">⚡</span>
        <div style="flex:1;">
          <strong>Take the assessment to personalize your course</strong>
          <p style="font-size:var(--text-sm);color:var(--text-secondary);margin:var(--space-1) 0 0;">Your Academic Superpowers™ profile unlocks archetype-specific content in every module.</p>
        </div>
        <a href="/profile.html" class="btn btn-secondary btn-sm" style="flex-shrink:0;">Take Assessment</a>
      </div>` : '';

    renderPanel(`
      <div class="panel-content">
        <div style="margin-bottom:var(--space-6);">
          <span class="eyebrow" style="display:block;margin-bottom:var(--space-1);">Hero Academy</span>
          <h3 style="margin:0;">My Courses</h3>
        </div>
        ${noAssessmentBanner}
        ${flagshipSection}
      </div>`);

    wireCourseActions();
  }

  // ─── Course card builder ──────────────────────────────────────────────────
  function courseCard(c, role, mode) {
    const progress = c.progress || 0;
    const progressBar = `
      <div style="display:flex;align-items:center;gap:var(--space-3);">
        <div style="flex:1;height:6px;background:var(--gray-100);border-radius:99px;overflow:hidden;">
          <div style="width:${progress}%;height:100%;background:var(--h2eo-teal);border-radius:99px;transition:width 0.6s var(--ease-out);"></div>
        </div>
        <span style="font-size:var(--text-xs);color:var(--text-muted);font-weight:600;white-space:nowrap;">${progress}%</span>
      </div>`;

    let actionBtns = '';
    if (mode === 'enrolled') {
      if (role === 'Educator') {
        actionBtns = `<button class="btn btn-secondary btn-sm" data-manage-roster="${c.id}">Manage Roster</button>`;
      } else if (role === 'Parent') {
        actionBtns = `<button class="btn btn-secondary btn-sm" data-view-progress="${c.id}">View Progress</button>`;
      } else {
        actionBtns = `<button class="btn btn-primary btn-sm" data-open-course="${c.id}">Continue Learning</button>`;
      }
    } else {
      if (!role) {
        actionBtns = `<a href="login.html" class="btn btn-secondary btn-sm">Sign in to Enroll</a>`;
      } else if (role === 'Educator') {
        actionBtns = `<button class="btn btn-secondary btn-sm" data-build-course="${c.id}">Build Course</button>
                      <button class="btn btn-ghost btn-sm" data-enroll-students="${c.id}">Enroll Students</button>`;
      } else if (role === 'Parent') {
        actionBtns = `<button class="btn btn-secondary btn-sm" data-assign="${c.id}">Assign to Child</button>`;
      } else if (role === 'K12') {
        actionBtns = `<span style="font-size:var(--text-sm);color:var(--text-muted);">Assigned by educator or parent.</span>`;
      } else {
        actionBtns = `<button class="btn btn-primary btn-sm" data-enroll="${c.id}">Enroll</button>`;
      }
    }

    const nextLesson = c.nextLesson?.title ? `<span style="font-size:var(--text-xs);color:var(--text-muted);">Next: ${c.nextLesson.title}</span>` : '';
    const tags = Array.isArray(c.tags) && c.tags.length ? c.tags.map(t => `<span class="badge badge-gray" style="font-size:10px;padding:2px 8px;">${t}</span>`).join('') : '';

    return `
      <div style="background:var(--white);border-radius:var(--radius-xl);border:1px solid var(--border-subtle);padding:var(--space-6);transition:box-shadow var(--duration-base),border-color var(--duration-base);" class="hover-lift">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-4);flex-wrap:wrap;margin-bottom:var(--space-4);">
          <div style="flex:1;min-width:200px;">
            <h4 style="margin-bottom:var(--space-1);">${c.title}</h4>
            <p style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--space-3);">${c.description}</p>
            ${tags ? `<div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-bottom:var(--space-2);">${tags}</div>` : ''}
            ${nextLesson}
          </div>
          ${c.instructor ? `<span style="font-size:var(--text-sm);color:var(--text-secondary);white-space:nowrap;flex-shrink:0;">${c.instructor.name}</span>` : ''}
        </div>
        ${progress > 0 ? progressBar : ''}
        <div style="display:flex;align-items:center;gap:var(--space-3);margin-top:var(--space-5);">
          ${actionBtns}
        </div>
      </div>`;
  }

  // ─── Wire course action buttons ───────────────────────────────────────────
  function wireCourseActions() {
    if (!$panel) return;

    $panel.querySelectorAll('[data-open-course]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.Toast) Toast.info('Opening Course', 'Course viewer coming soon.');
      });
    });

    $panel.querySelectorAll('[data-enroll]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-enroll');
        btn.disabled = true;
        btn.textContent = 'Enrolling…';
        try {
          const resp = await apiFetch(`/api/v1/courses/${id}/enroll`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
          if (resp && resp.ok) {
            if (window.Toast) Toast.success('Enrolled!', 'You have been enrolled in this course.');
            btn.textContent = 'Enrolled';
          } else {
            if (window.Toast) Toast.error('Enrollment Failed', 'Please try again or contact support.');
            btn.disabled = false;
            btn.textContent = 'Enroll';
          }
        } catch {
          if (window.Toast) Toast.error('Connection Error', 'Unable to reach the server. Please try again.');
          btn.disabled = false;
          btn.textContent = 'Enroll';
        }
      });
    });

    $panel.querySelectorAll('[data-manage-roster]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.Toast) Toast.info('Roster Management', 'Roster management is coming soon for educators.');
      });
    });

    $panel.querySelectorAll('[data-view-progress]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.Toast) Toast.info('Progress View', 'Detailed progress tracking is coming soon.');
      });
    });

    $panel.querySelectorAll('[data-build-course]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.Toast) Toast.info('Course Builder', 'The course builder is coming soon for educators.');
      });
    });

    $panel.querySelectorAll('[data-enroll-students]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.Toast) Toast.info('Bulk Enrollment', 'Bulk student enrollment is coming soon.');
      });
    });

    $panel.querySelectorAll('[data-assign]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.Toast) Toast.info('Assign Course', 'Assigning courses to children is coming soon.');
      });
    });
  }

  // ─── Panel state helpers ──────────────────────────────────────────────────
  function emptyState(icon, title, message) {
    return `
      <div class="panel-content" style="text-align:center;padding:var(--space-12) var(--space-8);">
        <div style="font-size:3rem;margin-bottom:var(--space-4);">${icon}</div>
        <h3 style="margin-bottom:var(--space-3);">${title}</h3>
        <p style="color:var(--text-muted);">${message}</p>
      </div>`;
  }

  function loadingState(message) {
    return `
      <div class="panel-content" style="text-align:center;padding:var(--space-12) var(--space-8);">
        <div style="width:32px;height:32px;border:3px solid var(--border-subtle);border-top-color:var(--h2eo-teal);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto var(--space-4);"></div>
        <p style="color:var(--text-muted);">${message}</p>
      </div>
      <style>@keyframes spin{to{transform:rotate(360deg);}}</style>`;
  }

  function errorState(title, message) {
    return `
      <div class="panel-content" style="text-align:center;padding:var(--space-12) var(--space-8);">
        <div style="font-size:2rem;margin-bottom:var(--space-4);">⚠️</div>
        <h3 style="margin-bottom:var(--space-3);">${title}</h3>
        <p style="color:var(--text-muted);">${message}</p>
      </div>`;
  }

  // ─── Assessment prompt modal ──────────────────────────────────────────────
  function showAssessmentPrompt() {
    const existing = document.querySelector('.hero-modal-overlay');
    if (existing) { existing.style.display = 'flex'; return; }

    const overlay = document.createElement('div');
    overlay.className = 'hero-modal-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(10,22,40,0.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:var(--space-6);';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Take your Academic Superpowers assessment');

    overlay.innerHTML = `
      <div style="background:var(--white);border-radius:var(--radius-2xl);padding:var(--space-10);max-width:480px;width:100%;box-shadow:var(--shadow-2xl);position:relative;" tabindex="-1">
        <div style="width:56px;height:56px;background:var(--surface-teal-tint);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;font-size:1.75rem;margin-bottom:var(--space-5);">⚡</div>
        <h3 style="margin-bottom:var(--space-3);">Discover Your Academic Superpowers™</h3>
        <p style="color:var(--text-secondary);line-height:1.65;margin-bottom:var(--space-8);">
          Your personalized learning experience starts with a short assessment. Find your archetype and unlock courses, paths, and coaching tailored to how you learn best.
        </p>
        <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;">
          <a href="/profile.html" class="btn btn-primary">Take the Assessment</a>
          <button type="button" class="btn btn-secondary" data-dismiss>Remind me later</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('[data-dismiss]')) {
        const user = storage.getCurrent();
        if (user) localStorage.setItem(`heroAssessmentPromptDismissed:${user.email}`, 'true');
        overlay.style.display = 'none';
      }
    });
  }

  // ─── Wire dashboard buttons ───────────────────────────────────────────────
  function initDashboard() {
    // Feature card buttons
    const btnMap = {
      btnViewAssessment: showAssessment,
      btnViewProfile: showFullProfile,
      btnViewCourses: showCourses,
      btnViewEnrolled: showEnrolledCourses,
    };

    // Sidebar nav links
    const navMap = {
      navAssessment: showAssessment,
      navCourses: showCourses,
      navEnrolled: showEnrolledCourses,
      navProfile: showFullProfile,
    };

    Object.entries({ ...btnMap, ...navMap }).forEach(([id, handler]) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          handler();
        });
      }
    });
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    $panel = document.getElementById('panel');
    if (!$panel) return; // Not on the dashboard page

    const authed = requireAuth();
    if (!authed) return;

    initHeroDisplay();
    initDashboard();

    // Prompt for assessment if not done
    const user = storage.getCurrent();
    if (user) {
      const dismissed = localStorage.getItem(`heroAssessmentPromptDismissed:${user.email}`) === 'true';
      const hasAssessment = !!localStorage.getItem(`heroAssessment:${user.email}`);
      if (!dismissed && !hasAssessment) {
        // Small delay so the page renders first
        setTimeout(showAssessmentPrompt, 800);
      }
    }
  });

})();
