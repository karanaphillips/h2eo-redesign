/* ============================================================
   Hero LMS — Access Control
   ============================================================
   Rules:
   • Module 1 of every course → FREE with any login
   • K-12 learners → subscription required for modules 2+
   • Adult learners → per-course purchase required for modules 2+
   • Educators / Admins → full access
   ============================================================ */

window.HeroAccess = (function () {

  /* ── Storage keys ────────────────────────────────────── */
  const keys = {
    subscription: (email) => `heroSubscription:${email}`,
    purchase:     (email, courseId) => `heroPurchase:${email}:${courseId}`,
    role:         (email) => `heroRole:${email}`,
  };

  /* ── Role helpers ────────────────────────────────────── */
  const K12_ROLES   = ['K12', 'Student', 'student', 'k12'];
  const ADULT_ROLES = ['Adult', 'adult', 'Professional', 'professional'];
  const FREE_ROLES  = ['Educator', 'educator', 'Admin', 'admin', 'super_admin'];

  function getRole(email) {
    return localStorage.getItem(keys.role(email)) || 'Adult';
  }

  function isK12(email) {
    return K12_ROLES.includes(getRole(email));
  }

  function isFreeRole(email) {
    return FREE_ROLES.includes(getRole(email));
  }

  /* ── Subscription helpers ────────────────────────────── */
  function getSubscription(email) {
    try {
      const raw = localStorage.getItem(keys.subscription(email));
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function hasActiveSubscription(email) {
    const sub = getSubscription(email);
    if (!sub) return false;
    if (sub.status !== 'active') return false;
    if (sub.expiresAt && new Date(sub.expiresAt) < new Date()) return false;
    return true;
  }

  /* Activate subscription (called from payment-success.html) */
  function activateSubscription(email, plan) {
    const expiresAt = plan === 'k12-annual'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 30  * 24 * 60 * 60 * 1000).toISOString();

    localStorage.setItem(keys.subscription(email), JSON.stringify({
      plan,
      status: 'active',
      activatedAt: new Date().toISOString(),
      expiresAt,
    }));
  }

  /* ── Course purchase helpers ─────────────────────────── */
  function hasPurchase(email, courseId) {
    try {
      const raw = localStorage.getItem(keys.purchase(email, courseId));
      return raw ? JSON.parse(raw).status === 'active' : false;
    } catch { return false; }
  }

  /* Activate course purchase (called from payment-success.html) */
  function activatePurchase(email, courseId) {
    localStorage.setItem(keys.purchase(email, courseId), JSON.stringify({
      courseId,
      status: 'active',
      purchasedAt: new Date().toISOString(),
    }));
  }

  /* ── Core access check ───────────────────────────────── */
  /*
    Returns:
      { allowed: true }                          → user can view this module
      { allowed: false, reason: 'login' }        → not logged in
      { allowed: false, reason: 'subscription',  → K-12 needs subscription
          role: 'K12', email }
      { allowed: false, reason: 'purchase',      → Adult needs to buy course
          courseId, email }
  */
  function canAccessModule(email, moduleNumber, courseId) {
    courseId = courseId || 'activate-superpowers';

    // Module 1 is always free with any login
    if (moduleNumber === 1) return { allowed: true, free: true };

    // Must be logged in for modules 2+
    if (!email) return { allowed: false, reason: 'login' };

    // Educators / admins get full access
    if (isFreeRole(email)) return { allowed: true };

    // K-12: requires subscription
    if (isK12(email)) {
      if (hasActiveSubscription(email)) return { allowed: true };
      return { allowed: false, reason: 'subscription', role: 'K12', email };
    }

    // Adults: requires course purchase
    if (hasPurchase(email, courseId)) return { allowed: true };
    return { allowed: false, reason: 'purchase', courseId, email };
  }

  /* ── Stripe redirect helpers ─────────────────────────── */
  function buildStripeUrl(baseUrl, email, plan, returnPath) {
    const url = new URL(baseUrl);
    // Pre-fill email if possible
    if (email) url.searchParams.set('prefilled_email', email);
    // Pass plan + return path in client_reference_id via success URL
    const successBase = window.HERO_AUTH_CONFIG?.stripe?.successUrl
      || `${window.location.origin}/hero/payment-success.html`;
    const successUrl = `${successBase}?plan=${encodeURIComponent(plan)}&return=${encodeURIComponent(returnPath || '/hero/index.html')}`;
    // Note: for Stripe Payment Links, append success_url via `?` params isn't supported
    // Instead, store the return path in localStorage before redirecting
    localStorage.setItem('heroPaymentReturn', returnPath || '/hero/index.html');
    localStorage.setItem('heroPaymentPlan', plan);
    return url.toString();
  }

  function redirectToSubscription(email, plan, returnPath) {
    const cfg = window.HERO_AUTH_CONFIG?.stripe;
    if (!cfg) { alert('Payment not configured. Please contact support.'); return; }
    const product = plan === 'k12-annual' ? cfg.k12Annual : cfg.k12Monthly;
    if (!product?.paymentLinkUrl || product.paymentLinkUrl.includes('YOUR_')) {
      // Demo mode: simulate subscription
      if (confirm(`[Demo Mode] Simulate activating ${product?.label || 'K-12'} subscription?`)) {
        activateSubscription(email, plan);
        window.location.href = returnPath || '/hero/index.html';
      }
      return;
    }
    localStorage.setItem('heroPaymentReturn', returnPath || '/hero/index.html');
    localStorage.setItem('heroPaymentPlan', plan);
    window.location.href = buildStripeUrl(product.paymentLinkUrl, email, plan, returnPath);
  }

  function redirectToCoursePurchase(email, courseId, returnPath) {
    const cfg = window.HERO_AUTH_CONFIG?.stripe;
    if (!cfg) { alert('Payment not configured. Please contact support.'); return; }
    const product = cfg.courses?.[courseId];
    if (!product?.paymentLinkUrl || product.paymentLinkUrl.includes('YOUR_')) {
      // Demo mode: simulate purchase
      if (confirm(`[Demo Mode] Simulate purchasing "${product?.title || courseId}" for ${product?.price || '$97'}?`)) {
        activatePurchase(email, courseId);
        window.location.href = returnPath || '/hero/index.html';
      }
      return;
    }
    localStorage.setItem('heroPaymentReturn', returnPath || '/hero/index.html');
    localStorage.setItem('heroPaymentPlan', `course:${courseId}`);
    window.location.href = buildStripeUrl(product.paymentLinkUrl, email, `course:${courseId}`, returnPath);
  }

  /* ── Public API ──────────────────────────────────────── */
  return {
    canAccessModule,
    isK12,
    isFreeRole,
    getRole,
    hasActiveSubscription,
    hasPurchase,
    activateSubscription,
    activatePurchase,
    redirectToSubscription,
    redirectToCoursePurchase,
    keys,
  };

})();
