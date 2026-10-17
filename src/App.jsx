import { useEffect, useMemo, useRef, useState } from 'react'
import { CLIENT } from './config.js'
import { INCLUDED_NOTE, SECTIONS } from './services.js'
import { calculateEstimate, formatPrice, priceLabel, pricesConfigured } from './lib/pricing.js'
import { validateAll, validateField } from './lib/validation.js'
import { FORM_SUBMIT_ACTION, buildSubmission, sendSubmission } from './lib/submission.js'
import ChecklistGroup from './components/Checklist.jsx'
import { CheckMark, Field } from './components/ui.jsx'

const INITIAL_VALUES = { fullName: '', phone: '', notes: '' }
const SHOW_PRICES = pricesConfigured()

export default function App() {
  const [selection, setSelection] = useState({})
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [submitError, setSubmitError] = useState('')
  const [sent, setSent] = useState(null)

  const estimate = useMemo(() => calculateEstimate(selection), [selection])

  const toggle = (groupId, itemId) =>
    setSelection((s) => {
      const cur = s[groupId] ?? []
      return { ...s, [groupId]: cur.includes(itemId) ? cur.filter((x) => x !== itemId) : [...cur, itemId] }
    })

  const setField = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: validateField(name, value) }))
  }
  const blurField = (name) => setErrors((e) => ({ ...e, [name]: validateField(name, values[name]) }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    const errs = validateAll(values)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      setSubmitError('')
      const el = document.getElementById(first)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.focus({ preventScroll: true })
      return
    }
    setStatus('sending')
    setSubmitError('')
    try {
      await sendSubmission(buildSubmission(values, estimate))
      setSent(estimate)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setSubmitError(err.message)
    }
  }

  if (status === 'success' && sent) return <Success estimate={sent} />

  const count = estimate.lines.length

  return (
    <>
      <Header />
      <main className="wrap page">
        <div className="intro">
          <p className="mono muted">{CLIENT.name} × Sonder</p>
          <h1 className="intro__title">Website requirement checklist</h1>
          <p className="intro__copy">Tick everything you’d like included in your new website.</p>
          <div className="intro__note">
            {priceLabel('coreWebsite') && (
              <p className="intro__core">
                <span>Complete website revamp</span>
                <span className="mono">{priceLabel('coreWebsite')}</span>
              </p>
            )}
            <p>{INCLUDED_NOTE}</p>
          </div>
        </div>

        <form action={FORM_SUBMIT_ACTION} method="POST" noValidate onSubmit={onSubmit} aria-label="Website requirement checklist">
          {SECTIONS.map((sec) => (
            <section key={sec.id} className="group" aria-labelledby={`grp-${sec.id}`}>
              <h2 id={`grp-${sec.id}`} className="group__title">
                <span className="mono group__letter" aria-hidden="true">{sec.letter}</span>
                {sec.title}
              </h2>
              <ul className="list">
                {sec.groups.map((g) => (
                  <ChecklistGroup key={g.id} group={g} chosen={selection[g.id] ?? []} onToggle={toggle} />
                ))}
              </ul>
            </section>
          ))}

          <section className="group" aria-labelledby="details-title">
            <h2 id="details-title" className="group__title">Your details</h2>
            <div className="details">
              <Field id="fullName" label="Your name" required error={errors.fullName}>
                {(a11y) => (
                  <input {...a11y} name="full_name" autoComplete="name" value={values.fullName}
                    onChange={(e) => setField('fullName', e.target.value)} onBlur={() => blurField('fullName')} />
                )}
              </Field>
              <Field id="phone" label="Phone / WhatsApp" required error={errors.phone}>
                {(a11y) => (
                  <input {...a11y} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210"
                    value={values.phone} onChange={(e) => setField('phone', e.target.value)} onBlur={() => blurField('phone')} />
                )}
              </Field>
              <div className="details__full">
                <Field id="notes" label="Anything else?" optional hint="Describe any custom feature here, or add other notes.">
                  {(a11y) => (
                    <textarea {...a11y} name="notes" rows={3} value={values.notes} onChange={(e) => setField('notes', e.target.value)} />
                  )}
                </Field>
              </div>
            </div>
          </section>

          <div className="submit">
            {SHOW_PRICES && (
              <div className="submit__total">
                <span className="mono muted">Estimated Investment</span>
                <span className="submit__amount" aria-live="polite">
                  {estimate.hasFromPrices ? 'From ' : ''}{formatPrice(estimate.oneTimeTotal)}
                  {estimate.monthlyTotal > 0 && <span className="submit__monthly"> + {formatPrice(estimate.monthlyTotal)} / month</span>}
                </span>
                {estimate.showCore && (
                  <p className="submit__note">Includes the complete website revamp ({formatPrice(estimate.coreAmount)}) plus the services you ticked.</p>
                )}
                <p className="submit__note">
                  This is an initial estimate based on your selected requirements. Final pricing will be confirmed after
                  reviewing your requirements.
                </p>
              </div>
            )}
            <div className="submit__row">
              <button type="submit" className="btn btn--primary" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                {status === 'sending' ? <><span className="spinner" aria-hidden="true" /> Sending…</> : <>Submit checklist <span aria-hidden="true">→</span></>}
              </button>
              <span className="mono muted">{count} {count === 1 ? 'service' : 'services'} ticked</span>
            </div>
            <div aria-live="assertive">
              {Object.values(errors).some(Boolean) && <p className="form-error">Please fill in the highlighted fields.</p>}
              {submitError && <p className="form-error">{submitError}</p>}
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  )
}

function Header() {
  return (
    <header className="header">
      <div className="wrap header__inner">
        <span className="brand" aria-label="Sonder">
          <span className="brand__word">sonder</span>
          <span className="brand__cursor" aria-hidden="true" />
        </span>
        <span className="pill"><span className="pill__dot" aria-hidden="true" />{CLIENT.name}</span>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner mono muted">
        <span>Prepared for {CLIENT.name}</span>
        <span>© {new Date().getFullYear()} Sonder AI Agency</span>
      </div>
    </footer>
  )
}

function Success({ estimate }) {
  const titleRef = useRef(null)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    titleRef.current?.focus({ preventScroll: true })
  }, [])
  return (
    <>
      <Header />
      <main className="wrap page success">
        <div className="success__mark" aria-hidden="true"><CheckMark /></div>
        <h1 className="intro__title" tabIndex={-1} ref={titleRef}>Thank you. We’ve received your requirements.</h1>
        <p className="intro__copy">Our team will review your selections and get back to you with the final scope and proposal.</p>
        {estimate.lines.length > 0 && (
          <ul className="success__list">
            {estimate.lines.map((l) => (
              <li key={l.groupId}><CheckMark /> {l.name}</li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  )
}
