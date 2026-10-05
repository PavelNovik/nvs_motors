import { useEffect, useRef, useState } from 'react'
import { brand, services, tel } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import { composeMessage, sendWhatsApp } from '../send.js'
import Icon from './Icon.jsx'
import SectionHead from './SectionHead.jsx'

const empty = { name: '', phone: '', car: '', service: '', date: '', message: '' }

// Заявка без бэкенда: собираем данные формы в текст и открываем WhatsApp (+48 453 182 276) с готовым сообщением
export default function Booking() {
  const { t, preset } = useLang()
  const b = t.booking
  const [form, setForm] = useState(empty)
  const [minDate, setMinDate] = useState(undefined)
  const carRef = useRef(null)

  useEffect(() => {
    setMinDate(new Date().toISOString().slice(0, 10))
  }, [])

  // Услуга из карточки → выбрать в форме и поставить фокус на первое пустое поле
  useEffect(() => {
    if (!preset) return
    setForm((f) => ({ ...f, service: preset.service }))
    const id = setTimeout(() => carRef.current?.closest('form')?.querySelector('input')?.focus({ preventScroll: true }), 600)
    return () => clearTimeout(id)
  }, [preset])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const serviceName = (id) => (id === 'other' ? b.other : t.services.items[id]?.name ?? '')

  const submit = (e) => {
    e.preventDefault()
    const date = form.date ? new Date(form.date + 'T12:00').toLocaleDateString(t.locale.replace('_', '-')) : ''
    const text = composeMessage([
      ['', b.hello],
      [b.fields.name, form.name],
      [b.fields.phone, form.phone],
      [b.fields.car, form.car],
      [b.fields.service, serviceName(form.service)],
      [b.fields.date, date],
      [b.fields.message, form.message],
    ])
    sendWhatsApp(text)
  }

  return (
    <section className="section" id="booking" aria-labelledby="booking-title">
      <div className="container booking">
        <div className="booking__intro">
          <SectionHead id="booking-title" eyebrow={b.eyebrow} title={b.title} lead={b.lead} />
          <ol className="steps" data-reveal>
            {b.steps.map((s, i) => (
              <li key={s}>
                <span className="steps__num">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="booking__alt" data-reveal>
            <Icon name="phone" size={18} />
            <a href={tel}>{brand.phone}</a>
          </p>
        </div>

        <form className="card glass form" data-glow data-reveal onSubmit={submit}>
          <div className="form__row">
            <Field label={b.fields.name} required>
              <input name="name" autoComplete="given-name" required value={form.name} onChange={set('name')} placeholder={b.placeholders.name} />
            </Field>
            <Field label={b.fields.phone}>
              <input name="phone" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set('phone')} placeholder={b.placeholders.phone} />
            </Field>
          </div>
          <Field label={b.fields.car} required>
            <input ref={carRef} name="car" required value={form.car} onChange={set('car')} placeholder={b.placeholders.car} />
          </Field>
          <div className="form__row">
            <Field label={b.fields.service}>
              <div className="select">
                <select name="service" value={form.service} onChange={set('service')}>
                  <option value="">{b.choose}</option>
                  {services.map((id) => (
                    <option key={id} value={id}>
                      {t.services.items[id].name}
                    </option>
                  ))}
                  <option value="other">{b.other}</option>
                </select>
                <Icon name="chevron" size={18} />
              </div>
            </Field>
            <Field label={b.fields.date}>
              <input name="date" type="date" min={minDate} value={form.date} onChange={set('date')} />
            </Field>
          </div>
          <Field label={b.fields.message}>
            <textarea name="message" rows="4" value={form.message} onChange={set('message')} placeholder={b.placeholders.message} />
          </Field>
          <button type="submit" className="btn btn--wa btn--lg btn--block">
            <Icon name="whatsapp" size={22} />
            {b.send}
          </button>
          <p className="form__note">{b.note}</p>
        </form>
      </div>
    </section>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="field">
      <span className="field__label">
        {label}
        {required && <span className="field__req" aria-hidden="true"> *</span>}
      </span>
      {children}
    </label>
  )
}
