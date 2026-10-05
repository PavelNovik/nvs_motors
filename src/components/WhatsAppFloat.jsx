import { waLink } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import Icon from './Icon.jsx'

export default function WhatsAppFloat() {
  const { t } = useLang()
  return (
    <a className="wa-float" href={waLink(t.wa.hello)} target="_blank" rel="noopener" aria-label={t.wa.label}>
      <Icon name="whatsapp" size={30} />
    </a>
  )
}
