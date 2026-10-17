import { PRICING } from '../config.js'
import { formatPrice, priceLabel } from '../lib/pricing.js'
import { Box } from './ui.jsx'

/** Extra lines under a service: what it includes, per-unit rates from PRICING, then any notes. */
function Extras({ group }) {
  const rates = PRICING[group.id]?.rates ?? []
  const includes = group.includes ?? []
  const notes = group.notes ?? []
  if (!includes.length && !rates.length && !notes.length) return null
  return (
    <span className="row__extras">
      {includes.length > 0 && (
        <span className="row__includes">
          {includes.map((i) => (
            <span key={i} className="row__include">{i}</span>
          ))}
        </span>
      )}
      {rates.length > 0 && (
        <span className="row__rates">
          If we create them: {rates.map((r) => `${formatPrice(r.amount)} ${r.unit}`).join(' · ')}
        </span>
      )}
      {notes.map((n) => (
        <span key={n} className="row__note">{n}</span>
      ))}
    </span>
  )
}

/** One service = one checkbox. Grouped services list what they include and are priced once. */
export default function ChecklistGroup({ group, checked, onToggle }) {
  const id = `svc-${group.id}`
  const label = priceLabel(group.id)
  return (
    <li>
      <label className={`row ${checked ? 'is-checked' : ''}`} htmlFor={id}>
        <input id={id} type="checkbox" className="sr-only" name={`service_${group.id}`} checked={checked} onChange={() => onToggle(group.id)} />
        <Box checked={checked} />
        <span className="row__text">
          <span className="row__title">{group.name}</span>
          <span className="row__desc">{group.description}</span>
          <Extras group={group} />
          {group.bonus && <span className="row__bonus mono">+ {group.bonus}</span>}
        </span>
        {label && <span className="row__price mono">{label}</span>}
      </label>
    </li>
  )
}
