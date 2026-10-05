import { useLang } from '../i18n/index.jsx'
import Icon from './Icon.jsx'
import SectionHead from './SectionHead.jsx'

// Вопросы на <details> — работают без JS и попадают в Schema.org FAQPage (src/seo.js)
export default function Faq() {
  const { t } = useLang()
  const f = t.faq
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="container faq">
        <SectionHead id="faq-title" eyebrow={f.eyebrow} title={f.title} center />
        <div className="faq__list">
          {f.items.map((item, i) => (
            <details key={item.q} className="faq__item glass" data-reveal style={{ '--d': `${i * 50}ms` }} open={i === 0}>
              <summary>
                <h3>{item.q}</h3>
                <Icon name="chevron" size={20} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
