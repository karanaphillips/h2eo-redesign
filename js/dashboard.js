/* Dashboard JS */
'use strict';

const API = '/api/v1';

function getToken() {
  return localStorage.getItem('h2eo_token') || sessionStorage.getItem('h2eo_token');
}
function getUser() {
  try {
    return JSON.parse(localStorage.getItem('h2eo_user') || sessionStorage.getItem('h2eo_user') || '{}');
  } catch { return {}; }
}
function logout() {
  localStorage.removeItem('h2eo_token');
  localStorage.removeItem('h2eo_user');
  sessionStorage.removeItem('h2eo_token');
  sessionStorage.removeItem('h2eo_user');
  Toast.info('Signed out', 'See you next time!');
  setTimeout(() => { window.location.href = 'login.html'; }, 1200);
}

// Populate user display
function initUserDisplay() {
  const user = getUser();
  const name = user.firstName || user.displayName || 'Learner';
  const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '') || '?';

  const welcomeName = document.getElementById('welcomeName');
  if (welcomeName) welcomeName.textContent = name;

  const displayName = document.getElementById('userDisplayName');
  if (displayName) displayName.textContent = user.displayName || name;

  const avatarEl = document.getElementById('userAvatarInitials');
  if (avatarEl) avatarEl.textContent = initials.toUpperCase();

  // Superpower badge
  const sp = user.superpowerProfile?.primarySuperpower;
  const spIcons = { brainiac: '🧠', crusader: '🛡️', mastermind: '♟️', handson: '⚙️' };
  const spLabels = { brainiac: 'The Brainiac', crusader: 'Creative Crusader', mastermind: 'The Mastermind', handson: 'Hands-on Hero' };
  if (sp) {
    const badge = document.getElementById('superpowerBadge');
    const icon = document.getElementById('spIcon');
    const nameEl = document.getElementById('spName');
    if (badge) badge.style.display = 'flex';
    if (icon) icon.textContent = spIcons[sp] || '⚡';
    if (nameEl) nameEl.textContent = spLabels[sp] || sp;

    // Update superpower card
    const content = document.getElementById('superpowerContent');
    if (content) {
      content.innerHTML = `
        <div style="font-size:2.5rem;margin-bottom:var(--space-3);">${spIcons[sp] || '⚡'}</div>
        <div class="badge badge-teal" style="margin-bottom:var(--space-3);">${spLabels[sp] || sp}</div>
        <p style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--space-5);">Your learning profile is active. Your courses and AI coaching are tailored to your Superpower.</p>
        <a href="results.html" class="btn btn-primary btn-sm">View Full Profile</a>
      `;
    }
  }
}

// Fetch live courses
async function loadCourses() {
  const token = getToken();
  if (!token) return;
  try {
    const res = await fetch(`${API}/courses/my-courses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      const courses = data.data?.courses || [];
      // Update stats
      const activeEl = document.getElementById('activeCourses');
      if (activeEl) activeEl.textContent = data.data?.activeCount ?? courses.length;
    }
  } catch {
    // Silently fail — UI shows placeholder data
  }
}

// Logout
document.getElementById('logoutSidebarBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  logout();
});
document.getElementById('userMenuBtn')?.addEventListener('click', () => {
  Toast.info('User menu', 'Profile settings coming soon.');
});
document.getElementById('notificationsBtn')?.addEventListener('click', () => {
  Toast.info('Notifications', 'You have 3 unread notifications.');
});

// Init
document.addEventListener('DOMContentLoaded', () => {
  initUserDisplay();
  loadCourses();
});
