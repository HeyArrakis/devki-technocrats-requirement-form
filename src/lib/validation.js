const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const REQUIRED_FIELDS = ['fullName', 'companyName', 'email', 'phone', 'mainGoal']

/** Returns an error message for one field, or '' when it is valid. */
export function validateField(name, value, form = {}) {
  const v = typeof value === 'string' ? value.trim() : value
  switch (name) {
    case 'fullName':
      return v ? (v.length < 2 ? 'Please enter your full name.' : '') : 'Please enter your name.'
    case 'companyName':
      return v ? '' : 'Please enter your company name.'
    case 'email':
      if (!v) return 'Please enter your email address.'
      return EMAIL_RE.test(v) ? '' : 'Please enter a valid email address, e.g. name@company.com'
    case 'phone': {
      if (!v) return 'Please enter a phone or WhatsApp number.'
      if (!/^\+?[\d\s\-().]+$/.test(v)) return 'Please use digits only (a leading + is fine).'
      const digits = v.replace(/\D/g, '')
      return digits.length >= 10 && digits.length <= 15 ? '' : 'Please enter a complete number (10–15 digits).'
    }
    case 'currentWebsite':
      if (!v) return ''
      return /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v) ? '' : 'Please enter a website address, e.g. yourcompany.com'
    case 'mainGoal':
      return v ? (v.length < 5 ? 'Please add a few more words.' : '') : 'Please tell us the main goal of your new website.'
    case 'customDetails':
      return form.customSelected && !v ? 'Please describe the feature you need, so we can scope it.' : ''
    case 'confirm':
      return v ? '' : 'Please confirm to continue.'
    default:
      return ''
  }
}

/** Order here is the order errors are focused in on submit. */
export const VALIDATION_ORDER = ['customDetails', 'fullName', 'companyName', 'email', 'phone', 'currentWebsite', 'mainGoal', 'confirm']

export function validateAll(values, ctx) {
  const errors = {}
  for (const name of VALIDATION_ORDER) {
    const msg = validateField(name, values[name], ctx)
    if (msg) errors[name] = msg
  }
  return errors
}
