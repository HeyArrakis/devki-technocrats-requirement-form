import { CLIENT } from '../config.js'
import { INCLUDED } from '../services.js'
import { CheckMark, Reveal, SectionHead } from './ui.jsx'

export function Header() {
  return (
    <header className="header">
      <div className="wrap header__inner">
        <a href="#top" className="brand" aria-label="Sonder">
          <span className="brand__word">sonder</span>
          <span className="brand__cursor" aria-hidden="true" />
        </a>
        <div className="header__right">
          <span className="header__title">Website Requirement Form</span>
          <span className="pill"><span className="pill__dot" aria-hidden="true" />{CLIENT.name}</span>
        </div>
      </div>
    </header>
  )
}

export function Hero() {
  return (
    <section className="hero wrap" id="top" aria-labelledby="hero-title">
      <Reveal className="hero__label mono">
        <span>{CLIENT.name.toUpperCase()}</span>
        <span className="hero__x" aria-hidden="true">×</span>
        <span>SONDER</span>
      </Reveal>
      <Reveal as="h1" id="hero-title" className="hero__title" delay={80}>
        Let’s build a website that represents your business <em>properly.</em>
      </Reveal>
      <div className="hero__bottom">
        <Reveal as="p" className="hero__copy" delay={160}>
          This short form helps us understand what you need from your new website. Select the services and features that
          are relevant to your business. We’ll use your responses to prepare the final scope and proposal.
        </Reveal>
        <Reveal className="hero__cta" delay={240}>
          <a href="#how" className="btn btn--primary">
            <span>Start the Form</span> <span aria-hidden="true" className="btn__arrow">↓</span>
          </a>
          <ul className="hero__meta mono">
            <li>≈ 5–8 minutes</li>
            <li>No technical knowledge needed</li>
            <li>Estimate updates as you choose</li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

const STEPS = [
  { n: '01', title: 'Choose your services', text: 'Tick the services and features you’d like. Your estimate updates instantly.' },
  { n: '02', title: 'Tell us about your business', text: 'A few simple questions about your goals and your customers.' },
  { n: '03', title: 'Receive your proposal', text: 'We review your answers and send you the final scope and proposal.' },
]

export function HowItWorks() {
  return (
    <section className="section wrap" id="how" aria-labelledby="how-title">
      <SectionHead number="01" eyebrow="How it works" title="Three simple steps." id="how-title" />
      <ol className="steps">
        {STEPS.map((s, i) => (
          <Reveal as="li" key={s.n} className="step" delay={i * 90}>
            <span className="step__n mono">{s.n}</span>
            <h3 className="step__title">{s.title}</h3>
            <p className="step__text">{s.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

export function Included({ coreLabel }) {
  return (
    <Reveal className="included" aria-labelledby="included-title">
      <div className="included__head">
        <div>
          <p className="mono small included__eyebrow">Core project · always included</p>
          <h3 id="included-title" className="included__title">Complete Website Revamp</h3>
        </div>
        <span className="included__price mono">{coreLabel}</span>
      </div>
      <p className="included__lead">
        Every website project includes the essential pages, responsive experience, basic SEO, technical setup, testing and
        launch. <strong>You only need to select the additional services you want.</strong>
      </p>
      <ul className="included__list">
        {INCLUDED.map((i) => (
          <li key={i.title}>
            <CheckMark />
            <span>
              <strong>{i.title}</strong>
              <span className="muted"> — {i.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span className="brand brand--sm">
          <span className="brand__word">sonder</span>
          <span className="brand__cursor" aria-hidden="true" />
        </span>
        <span className="mono small muted">Prepared for {CLIENT.name} · © {new Date().getFullYear()} Sonder AI Agency</span>
        <a className="mono small footer__link" href="https://sonderai.agency/" target="_blank" rel="noopener noreferrer">
          sonderai.agency ↗
        </a>
      </div>
    </footer>
  )
}
