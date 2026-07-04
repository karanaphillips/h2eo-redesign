/* ============================================================
   Hero LMS — OAuth & Payment Configuration
   ============================================================
   Fill in your credentials below. All keys are in ONE place.

   GOOGLE SETUP (5 min):
   1. Go to https://console.cloud.google.com/
   2. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   3. Application type: Web application
   4. Authorized JavaScript origins: http://localhost:4200  +  https://yourdomain.com
   5. Copy the Client ID below

   MICROSOFT SETUP (10 min):
   1. Go to https://portal.azure.com/ → Azure Active Directory → App registrations
   2. New registration → Name: "Hero LMS" → Accounts in any org + personal
   3. Redirect URI type: Single-page application → http://localhost:4200/hero/login.html
   4. Copy the Application (client) ID below

   STRIPE SETUP (10 min):
   1. Go to https://dashboard.stripe.com/
   2. Products → Add product → set name + price → Save
   3. Payment links → Create link for each product
   4. Set success URL to: https://yourdomain.com/hero/payment-success.html
   5. Copy the payment link URLs below
   ============================================================ */

window.HERO_AUTH_CONFIG = {

  /* ── Google OAuth ───────────────────────────────────── */
  google: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    // Example: '123456789-abcdefgh.apps.googleusercontent.com'
  },

  /* ── Microsoft OAuth ────────────────────────────────── */
  microsoft: {
    clientId: 'YOUR_MICROSOFT_CLIENT_ID',
    // Example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    authority: 'https://login.microsoftonline.com/common',
    scopes: ['openid', 'profile', 'email', 'User.Read'],
  },

  /* ── Stripe Payments ────────────────────────────────── */
  stripe: {
    // K-12 Subscription
    k12Monthly: {
      paymentLinkUrl: 'https://buy.stripe.com/YOUR_K12_MONTHLY_LINK',
      label: 'K-12 Monthly',
      price: '$9.99',
      period: '/month',
    },
    k12Annual: {
      paymentLinkUrl: 'https://buy.stripe.com/YOUR_K12_ANNUAL_LINK',
      label: 'K-12 Annual',
      price: '$79',
      period: '/year',
      savings: 'Save 34%',
    },

    // Adult per-course purchases
    courses: {
      'activate-superpowers': {
        paymentLinkUrl: 'https://buy.stripe.com/YOUR_ACTIVATE_SUPERPOWERS_LINK',
        title: 'Activate Your Superpowers™',
        price: '$97',
        period: 'one-time',
      },
    },

    // Success URL base — Stripe will redirect here after payment
    // Set this same URL in your Stripe dashboard as the success URL
    successUrl: `${window.location.origin}/hero/payment-success.html`,
  },

};
