import { describe, expect, it } from 'vitest'
import { buildSubmission } from './submission.js'
import { calculateEstimate } from './pricing.js'

describe('email payload', () => {
  it('lists each ticked service once with its price or label', () => {
    const est = calculateEstimate({ aiSmartFeatures: true, uiux: true, customFeature: true })
    const p = buildSubmission({ notes: '' }, est)
    expect(p.CLIENT).toBe('Devki Technocrats')
    expect(p['SELECTED — AI & Smart Features']).toBe('Yes — ₹5,000')
    expect(p['SELECTED — Website UI/UX Design']).toBe('Yes — ₹3,000')
    expect(p['SELECTED — Custom Website Feature']).toBe('Yes — Quoted separately')
    expect(p.NOTES).toBe('—')
  })

  it('says when nothing is ticked', () => {
    expect(buildSubmission({ notes: '' }, calculateEstimate({}))['SELECTED SERVICES']).toMatch(/Nothing ticked/)
  })

  it('totals the core website plus each ticked service once', () => {
    const est = calculateEstimate({ businessShowcase: true, branding: true, localSEO: true, advancedSEO: true, maintenance: true })
    expect(est.oneTimeTotal).toBe(20000 + 4000 + 2000 + 1000)
    expect(buildSubmission({ notes: 'Hi' }, est)['ESTIMATED INVESTMENT']).toBe('₹27,000 (incl. complete website revamp ₹20,000)')
  })

  it('ignores unticked services', () => {
    expect(calculateEstimate({ businessShowcase: false }).lines).toHaveLength(0)
  })
})

describe('sending', () => {
  it('explains a pending FormSubmit activation clearly', async () => {
    const { sendSubmission } = await import('./submission.js')
    const original = globalThis.fetch
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ success: 'false', message: 'This form needs Activation.' }), { status: 200 })
    try {
      await expect(sendSubmission({})).rejects.toThrow(/being activated/)
    } finally {
      globalThis.fetch = original
    }
  })
})
