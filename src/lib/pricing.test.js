import { describe, expect, it } from 'vitest'
import { calculateEstimate, priceLabel } from './pricing.js'

const pricing = {
  coreWebsite: { amount: 50000, type: 'fixed', billing: 'one-time' },
  branding: { amount: 20000, type: 'fixed', billing: 'one-time' },
  aiSmartFeatures: { amount: 40000, type: 'from', billing: 'one-time' },
  capabilitiesShowcase: { amount: 10000, type: 'fixed', billing: 'one-time' },
  ongoingSEO: { amount: 9000, type: 'from', billing: 'monthly' },
}
const groups = [
  { id: 'branding', name: 'Branding', items: [{ id: 'logo' }, { id: 'identity' }] },
  { id: 'aiSmartFeatures', name: 'AI', items: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }] },
  { id: 'capabilitiesShowcase', name: 'Caps', items: [1, 2, 3, 4, 5, 6].map((n) => ({ id: `c${n}` })) },
  { id: 'ongoingSEO', name: 'Ongoing SEO' },
]
const est = (selection) => calculateEstimate(selection, { pricing, groups })

describe('group-based pricing', () => {
  it('charges only the core website when nothing is selected', () => {
    expect(est({}).oneTimeTotal).toBe(50000)
    expect(est({}).lines).toHaveLength(0)
  })

  it('charges an AI group once whether one or all four features are selected', () => {
    expect(est({ aiSmartFeatures: ['a'] }).addOnsTotal).toBe(40000)
    expect(est({ aiSmartFeatures: ['a', 'b', 'c'] }).addOnsTotal).toBe(40000)
    expect(est({ aiSmartFeatures: ['a', 'b', 'c', 'd'] }).addOnsTotal).toBe(40000)
  })

  it('charges branding once for logo + identity', () => {
    expect(est({ branding: ['logo', 'identity'] }).addOnsTotal).toBe(20000)
  })

  it('charges capabilities once for all six showcase items', () => {
    expect(est({ capabilitiesShowcase: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'] }).addOnsTotal).toBe(10000)
  })

  it('adds different groups together, without duplicates', () => {
    const e = est({ branding: ['logo', 'identity'], aiSmartFeatures: ['a', 'b', 'c', 'd'] })
    expect(e.lines).toHaveLength(2)
    expect(e.oneTimeTotal).toBe(50000 + 20000 + 40000)
  })

  it('ignores groups whose selection is empty', () => {
    expect(est({ branding: [] }).addOnsTotal).toBe(0)
  })

  it('keeps monthly services out of the one-time total', () => {
    const e = est({ ongoingSEO: ['ongoingSEO'] })
    expect(e.oneTimeTotal).toBe(50000)
    expect(e.monthlyTotal).toBe(9000)
  })

  it('formats labels from config', () => {
    expect(priceLabel('branding', pricing)).toBe('₹20,000')
    expect(priceLabel('aiSmartFeatures', pricing)).toBe('From ₹40,000')
    expect(priceLabel('ongoingSEO', pricing)).toBe('From ₹9,000 / month')
  })
})

describe('unpriced services', () => {
  const empty = { coreWebsite: { amount: null }, branding: { amount: null, type: 'fixed', billing: 'one-time' } }
  it('shows no label and adds nothing when amount is null', () => {
    expect(priceLabel('branding', empty)).toBe('')
    const e = calculateEstimate({ branding: ['logo'] }, { pricing: empty, groups })
    expect(e.oneTimeTotal).toBe(0)
    expect(e.lines).toHaveLength(1)
    expect(e.showCore).toBe(false)
  })
})
