import { useEffect, useMemo, useRef, useState } from 'react'
import { CLIENT, PRICING } from './config.js'
import { SECTIONS, IMAGE_OPTIONS } from './services.js'
import { calculateEstimate, formatPrice, priceLabel } from './lib/pricing.js'
import { validateAll, validateField } from './lib/validation.js'
import { FORM_SUBMIT_ACTION, buildSubmission, sendSubmission } from './lib/submission.js'
import { useInView } from './lib/hooks.js'
import { Header, Hero, HowItWorks, Included, Footer } from './components/Sections.jsx'
import ServiceCard from './components/ServiceCard.jsx'
import { EstimateAside, EstimateBreakdown, MobileEstimate } from './components/Estimate.jsx'
import { Box, CheckMark, Field, Reveal, SectionHead } from './components/ui.jsx'

const INITIAL_VALUES = {
  fullName: '',
  companyName: CLIENT.name,
  email: '',
  phone: '',
  currentWebsite: CLIENT.website,
  mainGoal: '',
  mainCustomers: '',
  highlightServices: '',
  imagesAvailable: '',
  referenceWebsites: '',
  additionalNotes: '',
  customDetails: '',
  confirm: false,
}

export default function App() {
  const [selection, setSelection] = useState({})
  const [aiPrefs, setAiPrefs] = useState({ channel: '', languages: [], notes: '' })
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [submitError, setSubmitError] = useState('')
  const [sent, setSent] = useState(null)

  const estimate = useMemo(() => calculateEstimate(selection), [selection])
  const ctx = { customSelected: (selection.customFeature ?? []).length > 0 }

  const estimateRef = useRef(null)
  const confirmRef = useRef(null)
  const estimateInView = useInView(estimateRef)
  const confirmInView = useInView(confirmRef)

  // --- selection --------------------------------------------------------
  const toggleItem = (groupId, itemId) =>
    setSelection((s) => {
      const cur = s[groupId] ?? []
      return { ...s, [groupId]: cur.includes(itemId) ? cur.filter((x) => x !== itemId) : [...cur, itemId] }
    })
  const setGroup = (groupId, items) => setSelection((s) => ({ ...s, [groupId]: items }))

  // --- fields -----------------------------------------------------------
  const setField = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (touched[name] || errors[name]) {
      setErrors((e) => ({ ...e, [name]: validateField(name, value, ctx) }))
    }
  }
  const blurField = (name) => {
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors((e) => ({ ...e, [name]: validateField(name, values[name], ctx) }))
  }

  const text = (name, { required, optional, label, hint, placeholder, type = 'text', rows, autoComplete, inputMode, htmlName }) => (
    <Field id={name} label={label} required={required} optional={optional} hint={hint} error={errors[name]}>
      {(a11y) =>
        rows ? (
          <textarea
            {...a11y}
            name={htmlName}
            rows={rows}
            value={values[name]}
            placeholder={placeholder}
            onChange={(e) => setField(name, e.target.value)}
            onBlur={() => blurField(name)}
          />
        ) : (
          <input
            {...a11y}
            name={htmlName}
            type={type}
            value={values[name]}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={inputMode}
            onChange={(e) => setField(name, e.target.value)}
            onBlur={() => blurField(name)}
          />
        )
      }
    </Field>
  )

  // --- submit -----------------------------------------------------------
  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    const errs = validateAll(values, ctx)
    setErrors(errs)
    setTouched(Object.fromEntries(Object.keys(INITIAL_VALUES).map((k) => [k, true])))
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
      await sendSubmission(buildSubmission(values, estimate, aiPrefs))
      setSent({ estimate, name: values.fullName.trim().split(' ')[0] })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setSubmitError(err.message)
    }
  }

  if (status === 'success' && sent) return <Success sent={sent} />

  return (
    <>
      <a href="#services" className="skip-link">Skip to the form</a>
      <Header />
      <main>
        <Hero />
        <HowItWorks />

        <form
          className="wrap layout"
          action={FORM_SUBMIT_ACTION}
          method="POST"
          noValidate
          onSubmit={onSubmit}
          aria-label="Website requirement form"
        >
          <div className="layout__main">
            {/* 02 — SERVICES ------------------------------------------------ */}
            <section className="section section--tight" id="services" aria-labelledby="services-title">
              <SectionHead
                number="02"
                eyebrow="Choose your services"
                id="services-title"
                title="Select what you’d like us to include."
                intro="Tick only what’s relevant to you. Some services have several options — these are priced once, however many options you choose."
              />
              <Included coreLabel={PRICING.coreWebsite?.amount != null ? priceLabel('coreWebsite') : 'Included'} />

              {SECTIONS.map((sec) => (
                <div key={sec.id} className="svc-group" role="group" aria-labelledby={`grp-${sec.id}`}>
                  <Reveal className="svc-group__head">
                    <span className="svc-group__letter mono" aria-hidden="true">{sec.letter}</span>
                    <div>
                      <h3 id={`grp-${sec.id}`} className="svc-group__title">{sec.title}</h3>
                      <p className="svc-group__intro">{sec.intro}</p>
                    </div>
                  </Reveal>
                  <div className="cards">
                    {sec.groups.map((g) => (
                      <Reveal key={g.id}>
                        <ServiceCard
                          group={g}
                          chosen={selection[g.id] ?? []}
                          onToggle={toggleItem}
                          onSetAll={setGroup}
                          aiPrefs={aiPrefs}
                          setAiPrefs={setAiPrefs}
                          customDetails={values.customDetails}
                          onField={setField}
                          onBlur={blurField}
                          errors={errors}
                        />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* 03 — ABOUT YOUR BUSINESS -------------------------------------- */}
            <section className="section" id="about" aria-labelledby="about-title">
              <SectionHead
                number="03"
                eyebrow="About your business"
                id="about-title"
                title="A few quick details."
                intro="Short answers are perfectly fine. Fields marked * are required."
              />
              <Reveal className="fields">
                <div className="fields__grid">
                  {text('fullName', { label: 'Full name', required: true, autoComplete: 'name', htmlName: 'full_name' })}
                  {text('companyName', { label: 'Company name', required: true, autoComplete: 'organization', htmlName: 'company_name' })}
                  {text('email', { label: 'Email', required: true, type: 'email', autoComplete: 'email', inputMode: 'email', placeholder: 'name@company.com', htmlName: 'email' })}
                  {text('phone', { label: 'Phone / WhatsApp', required: true, type: 'tel', autoComplete: 'tel', inputMode: 'tel', placeholder: '+91 98765 43210', htmlName: 'phone' })}
                </div>
                {text('currentWebsite', { label: 'Current website', optional: true, type: 'url', inputMode: 'url', htmlName: 'current_website' })}
                {text('mainGoal', {
                  label: 'What is the main goal of your new website?',
                  required: true,
                  rows: 3,
                  placeholder: 'e.g. Look more professional to large industrial clients and get more quotation requests.',
                  htmlName: 'main_goal',
                })}
                {text('mainCustomers', {
                  label: 'Who are your main customers?',
                  optional: true,
                  rows: 2,
                  placeholder: 'e.g. Steel plants, cement, power and infrastructure companies.',
                  htmlName: 'main_customers',
                })}
                {text('highlightServices', {
                  label: 'Which services should we highlight most?',
                  optional: true,
                  rows: 2,
                  placeholder: 'e.g. Heavy fabrication, large-size CNC machining.',
                  htmlName: 'highlight_services',
                })}

                <fieldset className="field">
                  <legend className="field__label">
                    Do you have new / better images available? <span className="field__opt">Optional</span>
                  </legend>
                  <p className="field__hint">Photos of your facility, machinery, team or completed projects.</p>
                  <div className="segmented">
                    {IMAGE_OPTIONS.map((o) => (
                      <label key={o} className={`segmented__opt ${values.imagesAvailable === o ? 'is-on' : ''}`}>
                        <input
                          type="radio"
                          className="sr-only"
                          name="images_available"
                          value={o}
                          checked={values.imagesAvailable === o}
                          onChange={() => setField('imagesAvailable', o)}
                        />
                        {o}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {text('referenceWebsites', {
                  label: 'Reference websites',
                  optional: true,
                  hint: 'Any websites you like the look or feel of — from any industry.',
                  rows: 2,
                  placeholder: 'Paste links here, one per line',
                  htmlName: 'reference_websites',
                })}
                {text('additionalNotes', { label: 'Anything else you’d like us to know?', optional: true, rows: 3, htmlName: 'additional_notes' })}
              </Reveal>
            </section>

            {/* 04 — ESTIMATE ------------------------------------------------- */}
            <section className="section" id="estimate" aria-labelledby="estimate-title" ref={estimateRef}>
              <SectionHead number="04" eyebrow="Your estimate" id="estimate-title" title="Estimated investment." />
              <Reveal>
                <EstimateBreakdown estimate={estimate} />
              </Reveal>
            </section>

            {/* 05 — CONFIRM & SUBMIT ----------------------------------------- */}
            <section className="section" id="submit" aria-labelledby="confirm-title" ref={confirmRef}>
              <SectionHead number="05" eyebrow="Confirm & submit" id="confirm-title" title="Ready when you are." />
              <Reveal className="confirm">
                <div className={`field ${errors.confirm ? 'has-error' : ''}`}>
                  <label className={`confirm__check ${values.confirm ? 'is-selected' : ''}`} htmlFor="confirm">
                    <input
                      id="confirm"
                      type="checkbox"
                      className="sr-only"
                      name="confirmation"
                      checked={values.confirm}
                      aria-invalid={errors.confirm ? true : undefined}
                      aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                      onChange={(e) => setField('confirm', e.target.checked)}
                    />
                    <Box checked={values.confirm} />
                    <span>
                      I confirm these selections reflect what we’d like Sonder to include, and I understand this is an
                      estimate — not a final quotation.
                    </span>
                  </label>
                  <p id="confirm-error" className="field__error" role={errors.confirm ? 'alert' : undefined}>{errors.confirm}</p>
                </div>

                <div className="confirm__row">
                  <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                    {status === 'sending' ? (
                      <><span className="spinner" aria-hidden="true" /> Sending…</>
                    ) : (
                      <>Submit Requirements <span aria-hidden="true" className="btn__arrow">→</span></>
                    )}
                  </button>
                  <p className="confirm__summary mono small muted">
                    {estimate.lines.length} {estimate.lines.length === 1 ? 'service' : 'services'} selected ·{' '}
                    {estimate.hasFromPrices ? 'from ' : ''}{formatPrice(estimate.oneTimeTotal)}
                  </p>
                </div>
                <div aria-live="assertive">
                  {Object.values(errors).some(Boolean) && status !== 'sending' && (
                    <p className="form-error">Please check the highlighted fields above.</p>
                  )}
                  {submitError && <p className="form-error">{submitError}</p>}
                </div>
              </Reveal>
            </section>
          </div>

          <EstimateAside estimate={estimate} />
        </form>
      </main>
      <Footer />
      <MobileEstimate estimate={estimate} hidden={estimateInView || confirmInView} />
    </>
  )
}

function Success({ sent }) {
  const titleRef = useRef(null)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    titleRef.current?.focus({ preventScroll: true })
  }, [])
  return (
    <>
      <Header />
      <main className="success wrap" aria-labelledby="success-title">
        <div className="success__mark" aria-hidden="true"><CheckMark /></div>
        <p className="mono small muted">Submitted{sent.name ? ` · Thank you, ${sent.name}` : ''}</p>
        <h1 id="success-title" className="success__title" tabIndex={-1} ref={titleRef}>
          Thank you. We’ve received your requirements.
        </h1>
        <p className="success__copy">
          Our team will review your selections and get back to you with the final scope and proposal.
        </p>
        <div className="success__recap">
          <p className="mono small muted">What you sent</p>
          <ul className="sel">
            {sent.estimate.showCore && (
              <li className="sel__row"><span>Complete Website Revamp</span><span className="mono">Included</span></li>
            )}
            {sent.estimate.lines.map((l) => (
              <li key={l.groupId} className="sel__row"><span>{l.name}</span><CheckMark /></li>
            ))}
          </ul>
          <div className="success__total">
            <span className="mono small muted">Estimated Investment</span>
            <span className="success__amount">
              {sent.estimate.hasFromPrices ? 'From ' : ''}{formatPrice(sent.estimate.oneTimeTotal)}
            </span>
          </div>
          {sent.estimate.monthlyTotal > 0 && (
            <p className="mono small muted success__monthly">+ from {formatPrice(sent.estimate.monthlyTotal)} / month for ongoing services</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
