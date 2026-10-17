import { CLIENT, FORM_SUBMIT_EMAIL } from '../config.js'
import { formatPrice, pricesConfigured } from './pricing.js'

export const FORM_SUBMIT_ACTION = `https://formsubmit.co/${FORM_SUBMIT_EMAIL}`
const FORM_SUBMIT_AJAX = `https://formsubmit.co/ajax/${FORM_SUBMIT_EMAIL}`

export const isEmailConfigured = () => !/example\.com$/i.test(FORM_SUBMIT_EMAIL) && !/YOUR_SONDER/i.test(FORM_SUBMIT_EMAIL)

const orDash = (v) => (typeof v === 'string' && v.trim() ? v.trim() : '—')

const priceText = (l) =>
  l.amount == null
    ? l.label ? ` — ${l.label}` : ''
    : ` — ${l.type === 'from' ? 'From ' : ''}${formatPrice(l.amount)}${l.billing === 'monthly' ? ' / month' : ''}`

/**
 * Builds the email payload. Keys are inserted in reading order:
 * CLIENT DETAILS → SELECTED SERVICES → ESTIMATED INVESTMENT (only if prices are set) → NOTES
 */
export function buildSubmission(values, estimate) {
  const p = {
    _subject: `Website checklist — ${CLIENT.name} (${estimate.lines.length} services ticked)`,
    _template: 'box',
    _captcha: 'false',

    'CLIENT — Name': orDash(values.fullName),
    'CLIENT — Phone / WhatsApp': orDash(values.phone),
    'CLIENT — Company': CLIENT.name,
  }

  if (estimate.lines.length === 0) p['SELECTED SERVICES'] = 'Nothing ticked (core website only)'
  for (const line of estimate.lines) {
    const detail = line.items.length ? `Yes — ${line.items.join(', ')}` : 'Yes'
    p[`SELECTED — ${line.name}`] = `${detail}${priceText(line)}`
  }

  if (pricesConfigured()) {
    p['ESTIMATED INVESTMENT'] = `${estimate.hasFromPrices ? 'From ' : ''}${formatPrice(estimate.oneTimeTotal)}${
      estimate.showCore ? ` (incl. complete website revamp ${formatPrice(estimate.coreAmount)})` : ''
    }`
    if (estimate.monthlyTotal > 0) p['ESTIMATED INVESTMENT — Monthly'] = `${formatPrice(estimate.monthlyTotal)} / month`
  }

  p['NOTES'] = orDash(values.notes)
  p['Submitted at'] = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
  return p
}

/** Sends the payload to FormSubmit. Resolves on success, throws with a friendly message otherwise. */
export async function sendSubmission(payload) {
  if (!isEmailConfigured()) {
    console.error('[form] FORM_SUBMIT_EMAIL is still the placeholder — set it in src/config.js.')
    throw new Error('This form is not connected to an inbox yet. Please contact Sonder directly.')
  }
  let res
  try {
    res = await fetch(FORM_SUBMIT_AJAX, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('We couldn’t reach the server. Please check your connection and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok || String(data.success) !== 'true') {
    console.error('[form] FormSubmit response', res.status, data)
    throw new Error('Something went wrong while sending your form. Please try again in a moment.')
  }
  return data
}
