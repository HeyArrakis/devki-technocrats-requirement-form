import { describe, expect, it } from 'vitest'
import { buildSubmission } from './submission.js'
import { calculateEstimate } from './pricing.js'

const values = { fullName: 'Asha Mehta', phone: '+91 98765 43210', notes: '' }

describe('email payload', () => {
  it('lists ticked services with their chosen options', () => {
    const est = calculateEstimate({ aiSmartFeatures: ['aiAssistant', 'aiRfq'], uiux: ['uiux'] })
    const p = buildSubmission(values, est)
    expect(p['CLIENT — Name']).toBe('Asha Mehta')
    expect(p['SELECTED — AI & Smart Features']).toBe('Yes — AI Website Assistant, AI Enquiry / RFQ Assistant')
    expect(p['SELECTED — Website UI/UX Design']).toBe('Yes')
    expect(p.NOTES).toBe('—')
  })

  it('says when nothing is ticked', () => {
    expect(buildSubmission(values, calculateEstimate({}))['SELECTED SERVICES']).toMatch(/Nothing ticked/)
  })

  it('omits the estimate while no prices are configured', () => {
    const p = buildSubmission(values, calculateEstimate({ uiux: ['uiux'] }))
    expect(Object.keys(p).some((k) => k.startsWith('ESTIMATED'))).toBe(false)
  })
})
