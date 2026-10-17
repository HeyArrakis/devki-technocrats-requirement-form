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
 * Ticking one, several or all options inside a group adds the group's amount once.
 *
 *   amount  — rupees, e.g. 25000. Leave as null to show no price for that service.
 *   type    — 'fixed' shows "₹25,000"; 'from' shows "From ₹25,000"
 *   billing — 'one-time' counts toward the estimate; 'monthly' is shown as "/ month"
 *
 * While every amount is null, the page shows no prices and no total at all.
 */
export const PRICING = {
  // The complete website revamp (always included, not a checkbox)
  coreWebsite: { amount: null, type: 'fixed', billing: 'one-time' },

  // Branding & visual identity
  branding: { amount: null, type: 'fixed', billing: 'one-time' },
  uiux: { amount: null, type: 'fixed', billing: 'one-time' },
  visualContent: { amount: null, type: 'fixed', billing: 'one-time' },

  // Website & business showcase
  contentImageUpgrade: { amount: null, type: 'fixed', billing: 'one-time' },
  capabilitiesShowcase: { amount: null, type: 'fixed', billing: 'one-time' },
  projectsPortfolio: { amount: null, type: 'fixed', billing: 'one-time' },
  qualityCertification: { amount: null, type: 'fixed', billing: 'one-time' },
  companyProfilePdf: { amount: null, type: 'fixed', billing: 'one-time' },
  customFeature: { amount: null, type: 'fixed', billing: 'one-time' },

  // AI & smart features (ONE price for all four features)
  aiSmartFeatures: { amount: null, type: 'fixed', billing: 'one-time' },

  // Advanced online growth
  localSEO: { amount: null, type: 'fixed', billing: 'one-time' },
  advancedSEO: { amount: null, type: 'fixed', billing: 'one-time' },

  // Ongoing services (after launch)
  ongoingSEO: { amount: null, type: 'fixed', billing: 'monthly' },
  contentUpdates: { amount: null, type: 'fixed', billing: 'monthly' },
}
