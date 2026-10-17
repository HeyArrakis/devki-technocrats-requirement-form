/* ==========================================================================
   PROJECT CONFIGURATION — edit this file to change email, prices or client.
   ========================================================================== */

/**
 * Where completed forms are delivered (via https://formsubmit.co).
 *
 * ⚠️  REPLACE THIS PLACEHOLDER with Sonder's real inbox before sharing the link.
 *     The first submission to a new address triggers an activation email from
 *     FormSubmit — click "Activate Form" in that email, after which every
 *     submission is delivered. (Optional: after activation FormSubmit gives you
 *     a random alias string you can paste here instead, to hide the address.)
 *
 * Can also be set at build time with the VITE_FORM_SUBMIT_EMAIL env variable.
 */
export const FORM_SUBMIT_EMAIL =
  import.meta.env.VITE_FORM_SUBMIT_EMAIL || 'YOUR_SONDER_EMAIL@example.com'

/** Client details shown across the page and pre-filled in the form. */
export const CLIENT = {
  name: 'Devki Technocrats',
  website: 'https://devkitechnocrats.com/',
}

/** Currency formatting for every price on the page. */
export const CURRENCY = {
  code: 'INR',
  locale: 'en-IN',
}

/**
 * PRICING — one entry per SERVICE GROUP (not per checkbox).
 *
 * Selecting one, several or all items inside a group always adds the group's
 * amount exactly once.
 *
 *   amount  — number in rupees
 *   type    — 'fixed' shows "₹25,000"; 'from' shows "From ₹25,000"
 *   billing — 'one-time' counts towards the project estimate;
 *             'monthly' is shown separately as an ongoing monthly amount
 *
 * ⚠️  These amounts are PLACEHOLDERS — confirm them before sharing the link.
 */
export const PRICING = {
  // Always included — the complete website revamp. Set `amount: null` to hide
  // it from the estimate entirely (e.g. if quoted separately).
  coreWebsite: { amount: 60000, type: 'fixed', billing: 'one-time' },

  // Branding & visual identity
  branding: { amount: 25000, type: 'fixed', billing: 'one-time' },
  uiux: { amount: 30000, type: 'fixed', billing: 'one-time' },
  visualContent: { amount: 15000, type: 'from', billing: 'one-time' },

  // Website & business showcase
  contentImageUpgrade: { amount: 15000, type: 'from', billing: 'one-time' },
  capabilitiesShowcase: { amount: 20000, type: 'fixed', billing: 'one-time' },
  projectsPortfolio: { amount: 15000, type: 'fixed', billing: 'one-time' },
  qualityCertification: { amount: 10000, type: 'fixed', billing: 'one-time' },
  companyProfilePdf: { amount: 18000, type: 'fixed', billing: 'one-time' },
  customFeature: { amount: 15000, type: 'from', billing: 'one-time' },

  // AI & smart features (ONE price for all four features)
  aiSmartFeatures: { amount: 45000, type: 'from', billing: 'one-time' },

  // Advanced online growth
  localSEO: { amount: 12000, type: 'fixed', billing: 'one-time' },
  advancedSEO: { amount: 30000, type: 'from', billing: 'one-time' },

  // Ongoing services (after launch)
  ongoingSEO: { amount: 15000, type: 'from', billing: 'monthly' },
  contentUpdates: { amount: 6000, type: 'from', billing: 'monthly' },
}
