# Devki Technocrats × Sonder — Website Requirement Form

A simple, single-page **website requirement checklist** prepared by
[Sonder AI Agency](https://sonderai.agency/) for Devki Technocrats.

The client ticks the services they want, adds their name and phone number, and submits.
Prices and an estimated total appear only once prices are filled in (see below). The completed form is emailed to Sonder via
[FormSubmit](https://formsubmit.co) — there is no backend.

- React 19 + Vite 8, plain CSS (Sonder light design tokens), no UI framework
- Optional group-based pricing from one config object (hidden until set)
- Inline validation, accessible custom checkboxes, works on mobile
- Deploys to GitHub Pages with the included GitHub Actions workflow

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # pricing + email payload tests
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

Requires Node 20.19+ or 22.12+.

---

## Configuration — everything lives in `src/config.js`

### 1. Email recipient (FormSubmit) — **required before sharing**

```js
export const FORM_SUBMIT_EMAIL =
  import.meta.env.VITE_FORM_SUBMIT_EMAIL || 'YOUR_SONDER_EMAIL@example.com'
```

Replace the placeholder with Sonder's inbox, **or** leave the code alone and set a GitHub
repository variable named `FORM_SUBMIT_EMAIL`
(*Settings → Secrets and variables → Actions → Variables*) — the deploy workflow passes it in
at build time.

While the placeholder is in place the form will not send; it shows the client a polite
"not connected yet" message instead.

**One-time FormSubmit activation:** the very first submission to a new address does not get
delivered — FormSubmit emails that address an *“Activate Form”* link instead. Submit one test
entry from the live site, click the link in the activation email, and every submission after
that is delivered. After activation FormSubmit also shows a random alias (e.g.
`a1b2c3d4e5...`) — you can use that instead of the plain email address so it isn't visible
in the page source.

### 2. Prices

```js
export const PRICING = {
  coreWebsite: { amount: 20000 },
  branding: { amount: 2000 },
  uiux: { amount: 3000 },
  contentImageUpgrade: { amount: null, label: 'Free with your content', rates: [...] },
  businessShowcase: { amount: 4000 },
  customFeature: { amount: null, label: 'Quoted separately' },
  aiSmartFeatures: { amount: 5000 },
  localSEO: { amount: 1000 },
  advancedSEO: { amount: null, label: 'Priced on your goals' },
  maintenance: { amount: null, label: 'Free for 6 months' },
}
```

| Field    | Meaning |
|----------|---------|
| `amount` | Price in rupees, counted in the estimate when ticked. `null` = not counted. |
| `label`  | Text shown instead of a price when `amount` is `null` |
| `type`   | Optional `'from'` to show "From ₹4,000" |
| `rates`  | Optional per-unit rates listed under the service (used for content & images) |

The estimate = complete website revamp + each ticked priced group (once per group).

### 3. Pricing logic (group-based)

A group is charged once as soon as at least one of its options is ticked:

| Group | Options | Price |
|-------|---------|-------|
| Logo & Brand Identity | Logo design / redesign, Brand identity (+ brand guidelines included) | ₹2,000 |
| Website UI/UX Design | (+ visual content design included, first iteration only) | ₹3,000 |
| Business Showcase | Services & capabilities, Projects & portfolio, Quality & certifications, Company profile PDF | ₹4,000 |
| AI & Smart Features | AI Website Assistant, AI Enquiry / RFQ Assistant, Automated Email Response, AI Quotation Assistant | ₹5,000 |

`src/lib/pricing.test.js` and `src/lib/submission.test.js` cover this.

### 4. Services & copy

The checklist items and the "already included" line are in `src/services.js`. Each group's
`id` must match a key in `PRICING`.

### 5. Client details

`CLIENT` in `src/config.js` sets the client name shown on the page and in the email.

---

## The email Sonder receives

FormSubmit's `box` template, in this order: **CLIENT** (name, phone/WhatsApp, company) →
**SELECTED** services with the chosen options → **ESTIMATED INVESTMENT** (only once prices
are set) → **NOTES**.

---

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` tests, builds and deploys on every push to
`main`.

1. Push this repository to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).
4. The site is published at `https://<github-username>.github.io/devki-technocrats-requirement-form/`.

`vite.config.js` uses `base: './'`, so the build works under any repository name.

---

## Project structure

```
src/
  config.js            ← email, client, prices (edit here)
  services.js          ← service catalogue & copy
  App.jsx              ← page, state, validation, submit
  components/          ← checklist rows and form primitives
  lib/pricing.js       ← group-based estimate (+ tests)
  lib/submission.js    ← FormSubmit payload & send (+ tests)
  lib/validation.js    ← inline validation rules
  styles.css           ← Sonder light styles
```

No secrets, API keys or credentials are stored in this repository.
