import { useEffect, useState } from 'react'
import { openNow } from '../config.js'
import { useLang } from '../i18n/index.jsx'

// «Otwarte do 18:00» / «Teraz zamknięte» — считается только в браузере (время Варшавы), чтобы не расходиться с пререндером
export default function OpenStatus({ className = '' }) {
  const { t } = useLang()
  const [state, setState] = useState(null)
  useEffect(() => {
    const tick = () => setState(openNow())
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])
  if (!state) return null
  return (
    <span className={`status ${state.open ? 'is-open' : 'is-closed'} ${className}`}>
      <span className="status__dot" aria-hidden="true" />
      {state.open ? `${t.status.open} ${state.closes}` : t.status.closed}
    </span>
  )
}
