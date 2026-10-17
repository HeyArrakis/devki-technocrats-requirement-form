import { PRICING } from '../config.js'
import { priceLabel } from '../lib/pricing.js'
import { AI_PREFERENCES } from '../services.js'
import { Box, CheckMark, Field } from './ui.jsx'

function Tag({ groupId }) {
  const monthly = PRICING[groupId]?.billing === 'monthly'
  return <span className={`tag ${monthly ? 'tag--ongoing' : ''}`}>{monthly ? 'Ongoing' : 'Add-on'}</span>
}

function Price({ groupId }) {
  return <span className="card__price mono">{priceLabel(groupId)}</span>
}

/** Single-option service: the whole card is one checkbox. */
function SingleCard({ group, selected, onToggle, children }) {
  const inputId = `svc-${group.id}`
  return (
    <div className={`card ${selected ? 'is-selected' : ''}`}>
      <label className="card__main" htmlFor={inputId}>
        <input
          id={inputId}
          type="checkbox"
          className="sr-only"
          name={`service_${group.id}`}
          checked={selected}
          onChange={() => onToggle(group.id)}
        />
        <Box checked={selected} />
        <span className="card__body">
          <span className="card__title-row">
            <span className="card__title">{group.name}</span>
            <Tag groupId={group.id} />
          </span>
          <span className="card__desc">{group.description}</span>
        </span>
        <Price groupId={group.id} />
      </label>
      {children}
    </div>
  )
}

/** Multi-option service: several items, one group price. */
function MultiCard({ group, chosen, onToggle, onSetAll, children }) {
  const selected = chosen.length > 0
  const all = chosen.length === group.items.length
  const legendId = `svc-${group.id}-title`
  return (
    <fieldset className={`card card--multi ${selected ? 'is-selected' : ''}`} aria-labelledby={legendId}>
      {/* Mouse convenience: clicking the header selects every option (keyboard users have "Select all"). */}
      <div className="card__head" onClick={() => !selected && onSetAll(group.id, group.items.map((i) => i.id))} data-clickable={!selected || undefined}>
        <span className={`box box--status ${selected ? 'is-checked' : ''}`} aria-hidden="true">
          <CheckMark />
        </span>
        <div className="card__body">
          <div className="card__title-row">
            <span className="card__title" id={legendId}>{group.name}</span>
            <Tag groupId={group.id} />
          </div>
          <p className="card__desc">{group.description}</p>
        </div>
        <Price groupId={group.id} />
      </div>

      <div className="card__items-head">
        <span className="mono muted small">One price — choose any or all</span>
        <button type="button" className="text-btn" onClick={() => onSetAll(group.id, all ? [] : group.items.map((i) => i.id))}>
          {all ? 'Clear' : 'Select all'}
        </button>
      </div>
      <div className={`items ${group.items.some((i) => i.hint) ? 'items--detailed' : ''}`}>
        {group.items.map((item) => {
          const id = `svc-${group.id}-${item.id}`
          const on = chosen.includes(item.id)
          return (
            <label key={item.id} htmlFor={id} className={`item ${on ? 'is-selected' : ''}`}>
              <input
                id={id}
                type="checkbox"
                className="sr-only"
                name={`service_${group.id}_${item.id}`}
                checked={on}
                onChange={() => onToggle(group.id, item.id)}
              />
              <Box checked={on} />
              <span className="item__text">
                <span className="item__label">{item.label}</span>
                {item.hint && <span className="item__hint">{item.hint}</span>}
              </span>
            </label>
          )
        })}
      </div>
      {children}
    </fieldset>
  )
}

function Reveal({ open, children }) {
  return (
    <div className={`expand ${open ? 'is-open' : ''}`} inert={!open}>
      <div className="expand__inner">{children}</div>
    </div>
  )
}

function AiPreferences({ prefs, setPrefs }) {
  const toggleLang = (l) =>
    setPrefs((p) => ({ ...p, languages: p.languages.includes(l) ? p.languages.filter((x) => x !== l) : [...p.languages, l] }))
  return (
    <div className="extra">
      <p className="extra__title mono">Your preferences <span className="muted">— optional</span></p>
      <fieldset className="pref">
        <legend className="pref__label">Where should new enquiries reach you?</legend>
        <div className="chips">
          {AI_PREFERENCES.channels.map((c) => (
            <label key={c} className={`chip ${prefs.channel === c ? 'is-on' : ''}`}>
              <input
                type="radio"
                className="sr-only"
                name="ai_channel"
                value={c}
                checked={prefs.channel === c}
                onChange={() => setPrefs((p) => ({ ...p, channel: c }))}
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="pref">
        <legend className="pref__label">Which languages do your customers use?</legend>
        <div className="chips">
          {AI_PREFERENCES.languages.map((l) => (
            <label key={l} className={`chip ${prefs.languages.includes(l) ? 'is-on' : ''}`}>
              <input
                type="checkbox"
                className="sr-only"
                name={`ai_language_${l}`}
                checked={prefs.languages.includes(l)}
                onChange={() => toggleLang(l)}
              />
              {l}
            </label>
          ))}
        </div>
      </fieldset>
      <Field id="aiNotes" label="Anything specific the assistant should help with?" optional>
        {(a11y) => (
          <textarea
            {...a11y}
            name="ai_notes"
            rows={2}
            value={prefs.notes}
            placeholder="e.g. answer questions about our machining capacity"
            onChange={(e) => setPrefs((p) => ({ ...p, notes: e.target.value }))}
          />
        )}
      </Field>
    </div>
  )
}

export default function ServiceCard({ group, chosen, onToggle, onSetAll, aiPrefs, setAiPrefs, customDetails, onField, onBlur, errors }) {
  const selected = chosen.length > 0

  const extras = (
    <>
      {group.bonus && (
        <Reveal open={selected}>
          <p className="bonus"><CheckMark /> {group.bonus} — at no extra cost</p>
        </Reveal>
      )}
      {group.detailsPrompt && (
        <Reveal open={selected}>
          <div className="extra">
            <Field id="customDetails" label={group.detailsPrompt} required error={errors.customDetails}>
              {(a11y) => (
                <textarea
                  {...a11y}
                  name="custom_feature_description"
                  rows={3}
                  value={customDetails}
                  placeholder="e.g. a downloadable product catalogue, a client login area, a capacity calculator…"
                  onChange={(e) => onField('customDetails', e.target.value)}
                  onBlur={() => onBlur('customDetails')}
                />
              )}
            </Field>
          </div>
        </Reveal>
      )}
      {group.preferences && (
        <Reveal open={selected}>
          <AiPreferences prefs={aiPrefs} setPrefs={setAiPrefs} />
        </Reveal>
      )}
    </>
  )

  return group.items ? (
    <MultiCard group={group} chosen={chosen} onToggle={onToggle} onSetAll={onSetAll}>{extras}</MultiCard>
  ) : (
    <SingleCard group={group} selected={selected} onToggle={(id) => onToggle(id, id)}>{extras}</SingleCard>
  )
}
