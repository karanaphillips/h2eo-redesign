/* Shared nav/footer injector — included on every page */
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  function navLink(href, label, subLinks) {
    const isActive = href.split('/').pop() === currentPage ? ' class="active"' : '';
    if (!subLinks) {
      return `<li><a href="${href}"${isActive}>${label}</a></li>`;
    }
    return `<li>
      <a href="#"${isActive}>${label}
        <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </a>
      <div class="nav-dropdown" role="menu">
        ${subLinks.map(s => `<a href="${s[0]}" role="menuitem">${s[1]}<span>${s[2]}</span></a>`).join('')}
      </div>
    </li>`;
  }

  const NAV_HTML = `
<nav class="site-nav" role="navigation" aria-label="Main navigation">
  <a href="index.html" class="nav-brand">
    <img src="images/h2eo-logo.png" alt="H2EO" class="nav-logo" />
  </a>
  <ul class="nav-links" role="list">
    ${navLink('about.html','About')}
    ${navLink('#solutions','Solutions',[
      ['organizations.html','Organizations','Enterprise & institutional learning'],
      ['educators.html','Educators','Classroom & training tools'],
      ['professionals.html','Professionals','Career growth & workforce dev'],
      ['adults.html','Adult Learners','Lifelong learning pathways'],
      ['students.html','Students','Personalized student learning paths'],
      ['k12.html','K–12 & Parents','Student & parent resources'],
    ])}
    ${navLink('profile.html','Superpowers™')}
    ${navLink('hero/index.html','Hero LMS')}
    ${navLink('services.html','Services')}
    ${navLink('#resources','Resources',[
      ['resources.html','Resources','Guides, tools & downloads'],
      ['insights.html','Insights','Learning science articles & news'],
    ])}
    ${navLink('contact.html','Contact')}
  </ul>
  <div class="nav-actions">
    <a href="hero/login.html" class="nav-login">Sign In</a>
    <a href="contact.html" class="nav-cta btn">Book Consultation</a>
    <button class="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="mobile-menu" role="dialog" aria-label="Mobile navigation">
  <ul role="list">
    <li><a href="index.html">Home</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="organizations.html">Organizations</a></li>
    <li><a href="educators.html">Educators</a></li>
    <li><a href="professionals.html">Professionals</a></li>
    <li><a href="adults.html">Adult Learners</a></li>
    <li><a href="students.html">Students</a></li>
    <li><a href="k12.html">K–12</a></li>
    <li><a href="profile.html">Academic Superpowers™</a></li>
    <li><a href="hero/index.html">Hero LMS</a></li>
    <li><a href="services.html">Services</a></li>
    <li><a href="resources.html">Resources</a></li>
    <li><a href="insights.html">Insights</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
  <div class="mobile-menu-footer">
    <a href="hero/login.html" class="btn btn-secondary btn-block">Sign In</a>
    <a href="contact.html" class="btn btn-primary btn-block">Book Consultation</a>
  </div>
</div>`;

  const FOOTER_HTML = `
<footer class="site-footer" role="contentinfo">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-wordmark" style="
          font-family:var(--font-display,sans-serif);
          font-size:1.1rem;font-weight:800;
          color:white;letter-spacing:-0.01em;
          line-height:1.2;margin-bottom:var(--space-4,16px);
        ">Here to Educate Others, LLC</div>
        <p class="footer-desc">Here to Educate Others (H2EO) is a Learning Intelligence Ecosystem helping organizations, educators, professionals, and learners discover strengths and transform how learning happens.</p>
        <div class="footer-social" aria-label="Social media links">
          <a href="#" class="footer-social-link" aria-label="Facebook">f</a>
          <a href="#" class="footer-social-link" aria-label="YouTube">▶</a>
          <a href="#" class="footer-social-link" aria-label="LinkedIn">in</a>
        </div>
      </div>
      <div class="footer-col">
        <h5>Solutions</h5>
        <ul class="footer-links-list">
          <li><a href="organizations.html">Organizations</a></li>
          <li><a href="educators.html">Educators</a></li>
          <li><a href="professionals.html">Professionals</a></li>
          <li><a href="adults.html">Adult Learners</a></li>
          <li><a href="students.html">Students</a></li>
          <li><a href="k12.html">K–12 &amp; Parents</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Platform</h5>
        <ul class="footer-links-list">
          <li><a href="profile.html">Academic Superpowers™</a></li>
          <li><a href="hero/index.html">Hero LMS</a></li>
          <li><a href="dashboard.html">Dashboard</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="resources.html">Resources</a></li>
          <li><a href="insights.html">Insights</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Company</h5>
        <ul class="footer-links-list">
          <li><a href="about.html">About H2EO</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="hero/login.html">Sign In</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copyright">&copy; 2025 Here to Educate Others (H2EO), LLC. All rights reserved.</p>
      <nav class="footer-legal" aria-label="Legal links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Accessibility</a>
      </nav>
    </div>
  </div>
</footer>
<div id="toast-container" role="region" aria-label="Notifications" aria-live="polite"></div>`;

  // Inject nav
  const navMount = document.getElementById('nav-mount');
  if (navMount) navMount.outerHTML = NAV_HTML;

  // Inject footer
  const footerMount = document.getElementById('footer-mount');
  if (footerMount) footerMount.outerHTML = FOOTER_HTML;
})();
