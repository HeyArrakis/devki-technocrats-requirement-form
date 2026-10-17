import { useEffect, useMemo, useRef, useState } from 'react'
import { CLIENT } from './config.js'
import { INCLUDED_NOTE, SECTIONS } from './services.js'
import { calculateEstimate, formatPrice, priceLabel, pricesConfigured } from './lib/pricing.js'
import { FORM_SUBMIT_ACTION, buildSubmission, sendSubmission } from './lib/submission.js'
import ChecklistGroup from './components/Checklist.jsx'
import { CheckMark, Field } from './components/ui.jsx'

const SHOW_PRICES = pricesConfigured()

export default function App() {
  const [selection, setSelection] = useState({})
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('idle') // idle | success
  const [delivery, setDelivery] = useState('idle') // idle | sending | sent | failed
  const [submitError, setSubmitError] = useState('')
  const [sent, setSent] = useState(null)

  const estimate = useMemo(() => calculateEstimate(selection), [selection])

  const toggle = (groupId) => {
    setSelection((s) => ({ ...s, [groupId]: !s[groupId] }))
    setSubmitError('')
  }

  // Sending runs in the background: the thank-you page shows instantly and reports
  // delivery (with a retry) once FormSubmit answers.
  const deliver = (payload) => {
    setDelivery('sending')
    sendSubmission(payload)
      .then(() => setDelivery('sent'))
      .catch((err) => {
        setDelivery('failed')
        setSubmitError(err.message)
      })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (status === 'success') return
    if (estimate.lines.length === 0 && !notes.trim()) {
      setSubmitError('Please tick at least one service (or add a note) before submitting.')
      return
    }
    const payload = buildSubmission({ notes }, estimate)
    setSubmitError('')
    setSent({ estimate, payload })
    setStatus('success')
    deliver(payload)
  }

  if (status === 'success' && sent) {
    return <Success estimate={sent.estimate} delivery={delivery} error={submitError} onRetry={() => deliver(sent.payload)} />
  }

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
                  <ChecklistGroup key={g.id} group={g} checked={!!selection[g.id]} onToggle={toggle} />
                ))}
              </ul>
            </section>
          ))}

          <section className="group group--notes">
            <Field id="notes" label="Anything else?" optional hint="Describe any custom feature here, or add other notes.">
              {(a11y) => (
                <textarea {...a11y} name="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
              )}
            </Field>
          </section>

          <div className="submit">
            {SHOW_PRICES && (
              <p className="submit__note">
                This is an initial estimate based on your selected requirements. Final pricing will be confirmed after
                reviewing your requirements.
              </p>
            )}
            <div className="submit__row">
              <button type="submit" className="btn btn--primary">
                Submit checklist <span aria-hidden="true">→</span>
              </button>
              <span className="mono muted">{count} {count === 1 ? 'service' : 'services'} ticked</span>
            </div>
            <div aria-live="assertive">
              {submitError && <p className="form-error">{submitError}</p>}
            </div>
          </div>
        </form>
      </main>
      <Footer />
      {SHOW_PRICES && <PriceBar estimate={estimate} count={count} />}
    </>
  )
}

/** Fixed to the bottom of the screen so the total is always visible while ticking. */
function PriceBar({ estimate, count }) {
  return (
    <div className="pricebar" role="status" aria-live="polite" aria-atomic="true">
      <div className="wrap pricebar__inner">
        <div className="pricebar__left">
          <span className="mono pricebar__label">Estimated Investment</span>
          {/* key re-mounts the number on every change so the update animation replays */}
          <span key={estimate.oneTimeTotal} className="pricebar__amount">
            {estimate.hasFromPrices ? 'From ' : ''}{formatPrice(estimate.oneTimeTotal)}
            {estimate.monthlyTotal > 0 && <span className="pricebar__monthly"> + {formatPrice(estimate.monthlyTotal)} / month</span>}
          </span>
        </div>
        <span className="mono pricebar__meta">
          {estimate.showCore && <span className="pricebar__core">Website {formatPrice(estimate.coreAmount)} + </span>}
          {count} {count === 1 ? 'service' : 'services'}
        </span>
      </div>
    </div>
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

function Success({ estimate, delivery, error, onRetry }) {
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
        <div className="delivery" aria-live="polite">
          {delivery === 'sending' && (
            <p className="delivery__status mono"><span className="spinner spinner--dark" aria-hidden="true" /> Sending to Sonder…</p>
          )}
          {delivery === 'sent' && <p className="delivery__status delivery__status--ok mono"><CheckMark /> Delivered to Sonder</p>}
          {delivery === 'failed' && (
            <div className="delivery__failed">
              <p className="form-error">{error}</p>
              <button type="button" className="btn btn--primary" onClick={onRetry}>Try again</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
