import { describe, expect, it } from 'vitest'
import { calculateEstimate, priceLabel } from './pricing.js'

const pricing = {
  coreWebsite: { amount: 50000 },
  branding: { amount: 20000 },
  aiSmartFeatures: { amount: 40000, type: 'from' },
  customFeature: { amount: null, label: 'Quoted separately' },
}
const groups = [
  { id: 'branding', name: 'Branding', includes: ['Logo', 'Identity'] },
  { id: 'aiSmartFeatures', name: 'AI', includes: ['a', 'b', 'c', 'd'] },
  { id: 'customFeature', name: 'Custom' },
]
const est = (selection) => calculateEstimate(selection, { pricing, groups })

describe('pricing', () => {
  it('charges only the core website when nothing is ticked', () => {
    expect(est({}).oneTimeTotal).toBe(50000)
  })

  it('charges a grouped service once', () => {
    expect(est({ aiSmartFeatures: true }).addOnsTotal).toBe(40000)
    expect(est({ branding: true, aiSmartFeatures: true }).oneTimeTotal).toBe(50000 + 20000 + 40000)
  })

  it('lists unpriced services without adding to the total', () => {
    const e = est({ customFeature: true })
    expect(e.lines).toHaveLength(1)
    expect(e.oneTimeTotal).toBe(50000)
  })

  it('formats labels from config', () => {
    expect(priceLabel('branding', pricing)).toBe('₹20,000')
    expect(priceLabel('aiSmartFeatures', pricing)).toBe('From ₹40,000')
    expect(priceLabel('customFeature', pricing)).toBe('Quoted separately')
  })
})
