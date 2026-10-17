import { useReveal } from '../lib/hooks.js'

export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const [ref, visible] = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function SectionHead({ number, eyebrow, title, intro, id }) {
  return (
    <Reveal className="section-head">
      <div className="section-head__meta">
        <span className="mono">{number}</span>
        <span className="mono muted">{eyebrow}</span>
      </div>
      <h2 id={id} className="section-head__title">{title}</h2>
      {intro && <p className="section-head__intro">{intro}</p>}
    </Reveal>
  )
}

export function CheckMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="checkmark">
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  )
}

/** Visual checkbox: a real <input type="checkbox"> sits inside it, visually hidden. */
export function Box({ checked }) {
  return (
    <span className={`box ${checked ? 'is-checked' : ''}`} aria-hidden="true">
      <CheckMark />
    </span>
  )
}

export function Field({ id, label, required, optional, hint, error, children }) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {required && <span className="field__req" aria-hidden="true"> *</span>}
        {optional && <span className="field__opt"> Optional</span>}
      </label>
      {hint && <p id={hintId} className="field__hint">{hint}</p>}
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
        'aria-required': required || undefined,
      })}
      <p id={errorId} className="field__error" role={error ? 'alert' : undefined}>
        {error}
      </p>
    </div>
  )
}
