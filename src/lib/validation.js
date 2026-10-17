/** Returns an error message for one field, or '' when it is valid. */
export function validateField(name, value) {
  const v = typeof value === 'string' ? value.trim() : value
  switch (name) {
    case 'fullName':
      return v ? '' : 'Please enter your name.'
    case 'phone': {
      if (!v) return 'Please enter a phone or WhatsApp number.'
      if (!/^\+?[\d\s\-().]+$/.test(v)) return 'Please use digits only (a leading + is fine).'
      const digits = v.replace(/\D/g, '')
      return digits.length >= 10 && digits.length <= 15 ? '' : 'Please enter a complete number (10–15 digits).'
    }
    default:
      return ''
  }
}

export function validateAll(values) {
  const errors = {}
  for (const name of ['fullName', 'phone']) {
    const msg = validateField(name, values[name])
    if (msg) errors[name] = msg
  }
  return errors
}
