import { CURRENCY, PRICING } from '../config.js'
import { ALL_GROUPS, itemsOf } from '../services.js'

const formatter = new Intl.NumberFormat(CURRENCY.locale, {
  style: 'currency',
  currency: CURRENCY.code,
  maximumFractionDigits: 0,
})

export const formatPrice = (amount) => formatter.format(Math.round(amount || 0))

const hasAmount = (p) => p != null && p.amount != null

/** True once at least one price has been filled in — otherwise no prices or totals are shown. */
export const pricesConfigured = (pricing = PRICING) => Object.values(pricing).some(hasAmount)

/** "₹4,000", "From ₹4,000", "₹1,000 / month", or the entry's text label (e.g. "Quoted separately"). */
export function priceLabel(groupId, pricing = PRICING) {
  const p = pricing[groupId]
  if (!hasAmount(p)) return p?.label ?? ''
  const base = `${p.type === 'from' ? 'From ' : ''}${formatPrice(p.amount)}`
  return p.billing === 'monthly' ? `${base} / month` : base
}

/**
 * Group-based estimate.
 *
 * `selection` maps groupId → array of selected item ids. A group counts once
 * as soon as it has at least one selected item — selecting more items inside
 * the same group never adds to the price. Groups without a price add nothing.
 */
export function calculateEstimate(selection, { pricing = PRICING, groups = ALL_GROUPS } = {}) {
  const lines = []
  for (const group of groups) {
    const chosen = selection[group.id] ?? []
    if (chosen.length === 0) continue
    const p = pricing[group.id]
    lines.push({
      groupId: group.id,
      name: group.name,
      items: group.items ? itemsOf(group).filter((i) => chosen.includes(i.id)).map((i) => i.label) : [],
      amount: hasAmount(p) ? p.amount : null,
      label: p?.label ?? '',
      type: p?.type ?? 'fixed',
      billing: p?.billing ?? 'one-time',
    })
  }

  const core = pricing.coreWebsite
  const coreAmount = hasAmount(core) ? core.amount : 0
  const priced = lines.filter((l) => l.amount != null)
  const sum = (ls) => ls.reduce((t, l) => t + l.amount, 0)
  const oneTime = priced.filter((l) => l.billing !== 'monthly')
  const monthly = priced.filter((l) => l.billing === 'monthly')

  return {
    lines,
    showCore: hasAmount(core),
    coreAmount,
    addOnsTotal: sum(oneTime),
    oneTimeTotal: coreAmount + sum(oneTime),
    monthlyTotal: sum(monthly),
    hasFromPrices: priced.some((l) => l.type === 'from') || (hasAmount(core) && core.type === 'from'),
  }
}
