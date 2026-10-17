import { describe, expect, it } from 'vitest'
import { buildSubmission } from './submission.js'
import { calculateEstimate } from './pricing.js'

const values = {
  fullName: 'Asha Mehta', companyName: 'Devki Technocrats', email: 'asha@example.org', phone: '+91 98765 43210',
  currentWebsite: '', mainGoal: 'More enquiries', mainCustomers: '', highlightServices: '', imagesAvailable: 'Some',
  referenceWebsites: '', additionalNotes: '', customDetails: 'A catalogue',
}
const prefs = { channel: 'WhatsApp', languages: ['English'], notes: '' }

describe('email payload', () => {
  it('lists sections in reading order', () => {
    const est = calculateEstimate({ aiSmartFeatures: ['aiAssistant', 'aiRfq'], customFeature: ['customFeature'] })
    const keys = Object.keys(buildSubmission(values, est, prefs)).filter((k) => !k.startsWith('_'))
    const order = ['CLIENT DETAILS', 'BUSINESS REQUIREMENTS', 'SELECTED SERVICES', 'ESTIMATED INVESTMENT', 'ADDITIONAL NOTES']
    const firstIndex = order.map((s) => keys.findIndex((k) => k.startsWith(s)))
    expect(firstIndex.every((i) => i >= 0)).toBe(true)
    expect([...firstIndex].sort((a, b) => a - b)).toEqual(firstIndex)
  })

  it('includes selected services, AI preferences, custom description and estimate', () => {
    const est = calculateEstimate({ aiSmartFeatures: ['aiAssistant', 'aiRfq'], customFeature: ['customFeature'] })
    const p = buildSubmission(values, est, prefs)
    expect(p['SELECTED SERVICES — AI & Smart Features']).toContain('AI Website Assistant, AI Enquiry / RFQ Assistant')
    expect(p['SELECTED SERVICES — AI: where enquiries should reach']).toBe('WhatsApp')
    expect(p['SELECTED SERVICES — Custom feature description']).toBe('A catalogue')
    expect(p['ESTIMATED INVESTMENT — One-time project estimate']).toMatch(/₹/)
    expect(p._replyto).toBe('asha@example.org')
    expect(p['CLIENT DETAILS — Current website']).toBe('—')
  })

  it('notes when no extra services are chosen', () => {
    const p = buildSubmission(values, calculateEstimate({}), prefs)
    expect(p['SELECTED SERVICES — Additional services']).toMatch(/None selected/)
  })
})
