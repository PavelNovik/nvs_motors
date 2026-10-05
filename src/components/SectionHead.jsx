export default function SectionHead({ id, eyebrow, title, lead, center = false }) {
  return (
    <header className={`section-head${center ? ' section-head--center' : ''}`} data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-title">{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </header>
  )
}
