/* ==========================================================================
   PROJECT CONFIGURATION — edit this file to change email, prices or client.
   ========================================================================== */

/**
 * Where completed checklists are delivered (via https://formsubmit.co).
 *
 * The first submission to a new address triggers an "Activate Form" email from
 * FormSubmit — click it once, after which every submission is delivered.
 * (Optional: after activation FormSubmit gives you a random alias string you can
 * paste here instead, to hide the address from the page source.)
 *
 * Can also be overridden at build time with the VITE_FORM_SUBMIT_EMAIL env variable.
 */
export const FORM_SUBMIT_EMAIL =
  import.meta.env.VITE_FORM_SUBMIT_EMAIL || 'heyarrakis@gmail.com'

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
 *   amount — rupees, e.g. 4000. Counted in the estimate when ticked.
 *            null = not counted; shows `label` instead (e.g. "Quoted separately").
 *   type   — optional: 'from' shows "From ₹4,000" (default: fixed price)
 *   label  — text shown when there is no amount
 *   rates  — optional per-unit rates listed under the service
 */
export const PRICING = {
  // The complete website revamp (always included, not a checkbox)
  coreWebsite: { amount: 20000 },

  // A — Branding & design
  branding: { amount: 2000 },
  uiux: { amount: 3000 }, // visual content design included, first iteration only

  // B — Website & business showcase
  contentImageUpgrade: {
    amount: null,
    label: 'Free with your content',
    rates: [
      { amount: 150, unit: 'per image (high-end 4K)' },
      { amount: 200, unit: 'per content section' },
      { amount: 500, unit: 'per blog (image included)' },
    ],
  },
  // One price for any or all of: services & capabilities, projects & portfolio,
  // quality & certifications, company profile PDF
  businessShowcase: { amount: 4000 },
  customFeature: { amount: null, label: 'Quoted separately' },

  // C — AI & smart features (one price for all four features)
  aiSmartFeatures: { amount: 5000 },

  // D — Online growth
  localSEO: { amount: 1000 },
  advancedSEO: { amount: null, label: 'Priced on your goals' },

  // E — After launch
  maintenance: { amount: null, label: 'Free for 6 months' },
}
