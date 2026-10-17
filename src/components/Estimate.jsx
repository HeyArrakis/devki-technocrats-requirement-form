import { useEffect, useId, useState } from 'react'
import { formatPrice } from '../lib/pricing.js'
import { useAnimatedNumber } from '../lib/hooks.js'

export const DISCLAIMER =
  'This is an initial estimate based on your selected requirements. Final pricing will be confirmed after reviewing your requirements.'

const lineAmount = (l) => `${l.type === 'from' ? 'From ' : ''}${formatPrice(l.amount)}${l.billing === 'monthly' ? ' / mo' : ''}`

function Total({ estimate, size = 'lg' }) {
  const animated = useAnimatedNumber(estimate.oneTimeTotal)
  return (
    <div className={`total total--${size}`}>
      <span className="total__label mono">Estimated Investment</span>
      <span className="total__value" aria-live="polite" aria-atomic="true">
        {estimate.hasFromPrices && <span className="total__from">From</span>}
        <span className="sr-only">{formatPrice(estimate.oneTimeTotal)}</span>
        <span aria-hidden="true">{formatPrice(animated)}</span>
      </span>
      {estimate.monthlyTotal > 0 && (
        <span className="total__monthly mono">+ from {formatPrice(estimate.monthlyTotal)} / month ongoing</span>
      )}
    </div>
  )
}

function SelectedList({ estimate, compact }) {
  return (
    <ul className={`sel ${compact ? 'sel--compact' : ''}`}>
      {estimate.showCore && (
        <li className="sel__row sel__row--core">
          <span>Complete Website Revamp <span className="tag tag--included">Included</span></span>
          <span className="mono">{formatPrice(estimate.coreAmount)}</span>
        </li>
      )}
      {estimate.lines.map((l) => (
        <li key={l.groupId} className="sel__row sel__row--enter">
          <span>{l.name}</span>
          <span className="mono">{lineAmount(l)}</span>
        </li>
      ))}
      {estimate.lines.length === 0 && <li className="sel__empty">No additional services selected yet.</li>}
    </ul>
  )
}

/** Desktop: sticky panel beside the form. */
export function EstimateAside({ estimate }) {
  return (
    <aside className="aside" aria-label="Your estimate">
      <div className="aside__inner">
        <p className="mono muted small">Your selection · {estimate.lines.length} {estimate.lines.length === 1 ? 'service' : 'services'}</p>
        <SelectedList estimate={estimate} />
        <Total estimate={estimate} />
        <p className="aside__note">Services with several options are priced once — choose as many options as you like.</p>
        <a href="#submit" className="btn btn--ghost btn--block">Review &amp; submit ↓</a>
      </div>
    </aside>
  )
}

/** Mobile: compact floating bar that expands into a sheet. */
export function MobileEstimate({ estimate, hidden }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const animated = useAnimatedNumber(estimate.oneTimeTotal)
  useEffect(() => {
    if (hidden) setOpen(false)
  }, [hidden])
  return (
    <div className={`mbar ${hidden ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`} inert={hidden}>
      <div id={panelId} className="mbar__panel" inert={!open}>
        <p className="mono muted small">Your selection</p>
        <SelectedList estimate={estimate} compact />
        <p className="mbar__note">{DISCLAIMER}</p>
      </div>
      <button type="button" className="mbar__bar" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
        <span className="mbar__left">
          <span className="mono small muted">
            {estimate.lines.length} {estimate.lines.length === 1 ? 'service' : 'services'} · Estimated Investment
          </span>
          <span className="mbar__total">
            {estimate.hasFromPrices && <span className="total__from">From</span>}
            {formatPrice(animated)}
            {estimate.monthlyTotal > 0 && <span className="mbar__monthly mono"> + {formatPrice(estimate.monthlyTotal)}/mo</span>}
          </span>
        </span>
        <span className="mbar__toggle mono">{open ? 'Close' : 'View'} <span className="mbar__chev" aria-hidden="true">↑</span></span>
      </button>
    </div>
  )
}

/** Section 05 — full breakdown. */
export function EstimateBreakdown({ estimate }) {
  return (
    <div className="breakdown">
      <div className="breakdown__table">
        <div className="breakdown__group">
          <p className="mono muted small">One-time project</p>
          <SelectedList estimate={{ ...estimate, lines: estimate.oneTimeLines }} />
        </div>
        {estimate.monthlyLines.length > 0 && (
          <div className="breakdown__group">
            <p className="mono muted small">Ongoing, after launch</p>
            <ul className="sel">
              {estimate.monthlyLines.map((l) => (
                <li key={l.groupId} className="sel__row">
                  <span>{l.name}</span>
                  <span className="mono">{lineAmount(l)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="breakdown__total">
        <Total estimate={estimate} size="xl" />
        <p className="breakdown__disclaimer">{DISCLAIMER}</p>
      </div>
    </div>
  )
}
