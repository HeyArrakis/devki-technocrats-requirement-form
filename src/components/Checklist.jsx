import { priceLabel } from '../lib/pricing.js'
import { Box } from './ui.jsx'

function Price({ groupId }) {
  const label = priceLabel(groupId)
  return label ? <span className="row__price mono">{label}</span> : null
}

function Check({ id, name, checked, onChange, children }) {
  return (
    <label className={`row ${checked ? 'is-checked' : ''}`} htmlFor={id}>
      <input id={id} type="checkbox" className="sr-only" name={name} checked={checked} onChange={onChange} />
      <Box checked={checked} />
      {children}
    </label>
  )
}

/** One service group: a single checkbox, or a short list of options priced once. */
export default function ChecklistGroup({ group, chosen, onToggle }) {
  if (!group.items) {
    return (
      <li>
        <Check
          id={`svc-${group.id}`}
          name={`service_${group.id}`}
          checked={chosen.length > 0}
          onChange={() => onToggle(group.id, group.id)}
        >
          <span className="row__text">
            <span className="row__title">{group.name}</span>
            <span className="row__desc">{group.description}</span>
          </span>
          <Price groupId={group.id} />
        </Check>
      </li>
    )
  }

  const titleId = `svc-${group.id}-title`
  return (
    <li>
      <fieldset className={`multi ${chosen.length ? 'is-checked' : ''}`} aria-labelledby={titleId}>
        <div className="multi__head">
          <span className="row__text">
            <span className="row__title" id={titleId}>{group.name}</span>
            <span className="row__desc">{group.description}</span>
          </span>
          <Price groupId={group.id} />
        </div>
        <ul className="multi__items">
          {group.items.map((item) => (
            <li key={item.id}>
              <Check
                id={`svc-${group.id}-${item.id}`}
                name={`service_${group.id}_${item.id}`}
                checked={chosen.includes(item.id)}
                onChange={() => onToggle(group.id, item.id)}
              >
                <span className="row__text">
                  <span className="row__item">{item.label}</span>
                  {item.hint && <span className="row__desc">{item.hint}</span>}
                </span>
              </Check>
            </li>
          ))}
        </ul>
        {group.bonus && <p className="multi__note mono">+ {group.bonus}</p>}
      </fieldset>
    </li>
  )
}
