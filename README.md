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
  coreWebsite: { amount: null, type: 'fixed', billing: 'one-time' },
  branding:    { amount: null, type: 'fixed', billing: 'one-time' },
  ...
}
```

All amounts are currently `null`, so the page shows **no prices and no total**. Fill in an
amount (e.g. `25000`) and that price appears next to the service; the estimated total appears
as soon as any price is set.

| Field     | Meaning |
|-----------|---------|
| `amount`  | Price in rupees, or `null` for no price |
| `type`    | `'fixed'` → “₹25,000”, `'from'` → “From ₹25,000” |
| `billing` | `'one-time'` counts toward the project estimate; `'monthly'` is shown separately as ongoing |

Prices are never hard-coded in the UI; every label and total reads from `PRICING`.

### 3. Pricing logic (group-based)

Pricing is per **service group**, not per checkbox (`src/lib/pricing.js`). A group is
charged once as soon as at least one of its options is ticked:

| Group | Options shown | Charged |
|-------|---------------|---------|
| Logo & Brand Identity | Logo design / redesign, Brand identity (+ brand guidelines included) | once |
| Services & Capabilities Showcase | Services, Capabilities, Machinery, Facilities, Capacity, Industries served | once |
| Projects & Portfolio | Project showcase, Portfolio gallery, Case studies | once |
| AI & Smart Features | AI Website Assistant, AI Enquiry / RFQ Assistant, Automated Email Response, AI Quotation Assistant | once |
| Every other service | single option | once |

`src/lib/pricing.test.js` covers this (e.g. one vs. all four AI features → same price).

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
