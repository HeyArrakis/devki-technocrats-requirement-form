export function CheckMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="checkmark">
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  )
}

/** Visual checkbox: a real <input type="checkbox"> sits next to it, visually hidden. */
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
