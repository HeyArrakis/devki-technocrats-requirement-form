import { CURRENCY, PRICING } from '../config.js'
import { ALL_GROUPS, itemsOf } from '../services.js'

const formatter = new Intl.NumberFormat(CURRENCY.locale, {
  style: 'currency',
  currency: CURRENCY.code,
  maximumFractionDigits: 0,
})

export const formatPrice = (amount) => formatter.format(Math.round(amount || 0))

/** "₹25,000", "From ₹25,000", with "/ month" for ongoing services. */
export function priceLabel(groupId, pricing = PRICING) {
  const p = pricing[groupId]
  if (!p || p.amount == null) return 'Included'
  const base = `${p.type === 'from' ? 'From ' : ''}${formatPrice(p.amount)}`
  return p.billing === 'monthly' ? `${base} / month` : base
}

/**
 * Group-based estimate.
 *
 * `selection` maps groupId → array of selected item ids. A group counts once
 * as soon as it has at least one selected item — selecting more items inside
 * the same group never adds to the price.
 */
export function calculateEstimate(selection, { pricing = PRICING, groups = ALL_GROUPS } = {}) {
  const lines = []
  for (const group of groups) {
    const chosen = selection[group.id] ?? []
    if (chosen.length === 0) continue
    const p = pricing[group.id]
    const valid = itemsOf(group).filter((i) => chosen.includes(i.id))
    lines.push({
      groupId: group.id,
      name: group.name,
      items: group.items ? valid.map((i) => i.label) : [],
      amount: p?.amount ?? 0,
      type: p?.type ?? 'fixed',
      billing: p?.billing ?? 'one-time',
    })
  }

  const core = pricing.coreWebsite
  const coreAmount = core?.amount ?? 0
  const oneTimeLines = lines.filter((l) => l.billing !== 'monthly')
  const monthlyLines = lines.filter((l) => l.billing === 'monthly')
  const sum = (ls) => ls.reduce((t, l) => t + l.amount, 0)

  return {
    lines,
    oneTimeLines,
    monthlyLines,
    coreAmount,
    showCore: core?.amount != null,
    addOnsTotal: sum(oneTimeLines),
    oneTimeTotal: coreAmount + sum(oneTimeLines),
    monthlyTotal: sum(monthlyLines),
    hasFromPrices: lines.some((l) => l.type === 'from') || core?.type === 'from',
  }
}
