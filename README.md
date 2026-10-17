# Devki Technocrats × Sonder — Website Requirement Form

A single-page, client-facing **website requirement & service selection form** prepared by
[Sonder AI Agency](https://sonderai.agency/) for Devki Technocrats.

The client ticks the services they want, sees a live **Estimated Investment**, answers a few
business questions and submits. The completed form is emailed to Sonder via
[FormSubmit](https://formsubmit.co) — there is no backend.

- React 19 + Vite 8, plain CSS (Sonder light design tokens), no UI framework
- Group-based pricing from one config object
- Inline validation, accessible custom checkboxes, sticky estimate (desktop) / floating summary (mobile)
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
  coreWebsite: { amount: 60000, type: 'fixed', billing: 'one-time' },
  branding:    { amount: 25000, type: 'fixed', billing: 'one-time' },
  ...
  ongoingSEO:  { amount: 15000, type: 'from',  billing: 'monthly' },
}
```

| Field     | Meaning |
|-----------|---------|
| `amount`  | Price in rupees. For `coreWebsite`, `null` hides it from the estimate. |
| `type`    | `'fixed'` → “₹25,000”, `'from'` → “From ₹25,000” |
| `billing` | `'one-time'` counts toward the project estimate; `'monthly'` is shown separately as ongoing |

> ⚠️ The amounts currently in the file are **placeholders** — confirm them before sharing.

Prices are never hard-coded in the UI; every label and total reads from `PRICING`.

### 3. Pricing logic (group-based)

Pricing is per **service group**, not per checkbox (`src/lib/pricing.js`). A group is
charged once as soon as at least one of its options is ticked:

| Group | Options shown | Charged |
|-------|---------------|---------|
| Logo & Brand Identity | Logo design / redesign, Brand identity (+ brand guidelines, automatic) | once |
| Services & Capabilities Showcase | Services, Capabilities, Machinery, Facilities, Capacity, Industries served | once |
| Projects & Portfolio | Project showcase, Portfolio gallery, Case studies | once |
| AI & Smart Features | AI Website Assistant, AI Enquiry / RFQ Assistant, Automated Email Response, AI Quotation Assistant | once |
| Every other service | single option | once |

`src/lib/pricing.test.js` covers this (e.g. one vs. all four AI features → same price).

### 4. Services & copy

The service catalogue, the "already included" list and option labels are in
`src/services.js`. Each group's `id` must match a key in `PRICING`.

### 5. Client details

`CLIENT` in `src/config.js` sets the client name (header, hero, email subject) and the
pre-filled current website.

---

## The email Sonder receives

FormSubmit's `box` template, with fields in this order:

1. **CLIENT DETAILS** — name, company, email, phone/WhatsApp, current website
2. **BUSINESS REQUIREMENTS** — main goal, customers, services to highlight, images, references
3. **SELECTED SERVICES** — each selected group with its price and chosen options, custom
   feature description, AI preferences, number of pricing groups
4. **ESTIMATED INVESTMENT** — one-time estimate and any monthly amount
5. **ADDITIONAL NOTES** — client notes and submission time (IST)

The subject line includes the company and estimate; *Reply* goes straight to the client.

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
  components/          ← header/hero/sections, service cards, estimate, form primitives
  lib/pricing.js       ← group-based estimate (+ tests)
  lib/submission.js    ← FormSubmit payload & send (+ tests)
  lib/validation.js    ← inline validation rules
  styles.css           ← Sonder light design system
```

No secrets, API keys or credentials are stored in this repository.
