import { describe, expect, it } from 'vitest'
import { buildSubmission } from './submission.js'
import { calculateEstimate } from './pricing.js'

const values = { fullName: 'Asha Mehta', phone: '+91 98765 43210', notes: '' }

describe('email payload', () => {
  it('lists ticked services with their chosen options and price', () => {
    const est = calculateEstimate({ aiSmartFeatures: ['aiAssistant', 'aiRfq'], uiux: ['uiux'], customFeature: ['customFeature'] })
    const p = buildSubmission(values, est)
    expect(p['CLIENT — Name']).toBe('Asha Mehta')
    expect(p['SELECTED — AI & Smart Features']).toBe('Yes — AI Website Assistant, AI Enquiry / RFQ Assistant — ₹5,000')
    expect(p['SELECTED — Website UI/UX Design']).toBe('Yes — ₹3,000')
    expect(p['SELECTED — Custom Website Feature']).toBe('Yes — Quoted separately')
    expect(p.NOTES).toBe('—')
  })

  it('says when nothing is ticked', () => {
    expect(buildSubmission(values, calculateEstimate({}))['SELECTED SERVICES']).toMatch(/Nothing ticked/)
  })

  it('totals the core website plus ticked groups, each group once', () => {
    const est = calculateEstimate({
      businessShowcase: ['capabilitiesShowcase', 'projectsPortfolio', 'qualityCertification', 'companyProfilePdf'],
      branding: ['logoDesign', 'brandIdentity'],
      localSEO: ['localSEO'],
      advancedSEO: ['advancedSEO'],
      maintenance: ['maintenance'],
    })
    expect(est.oneTimeTotal).toBe(20000 + 4000 + 2000 + 1000)
    expect(buildSubmission(values, est)['ESTIMATED INVESTMENT']).toBe('₹27,000 (incl. complete website revamp ₹20,000)')
  })
})
