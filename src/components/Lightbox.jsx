import { useEffect, useRef } from 'react'
import { useLang } from '../i18n/index.jsx'
import Icon from './Icon.jsx'

// Полноэкранный просмотр на <dialog>: фокус-ловушка и Esc — средствами браузера.
// Стрелки ←/→ и свайп листают фото.
export default function Lightbox({ items, index, setIndex }) {
  const { t } = useLang()
  const l = t.lightbox
  const dialog = useRef(null)
  const touchX = useRef(null)
  const open = index !== null && items[index]

  useEffect(() => {
    const d = dialog.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const go = (step) => setIndex((i) => (i + step + items.length) % items.length)

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') go(-1)
    if (e.key === 'ArrowRight') go(1)
  }

  const item = open ? items[index] : null

  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label={l.label}
      onClose={() => setIndex(null)}
      onKeyDown={onKey}
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - (touchX.current ?? 0)
        if (Math.abs(dx) > 50) go(dx > 0 ? -1 : 1)
      }}
    >
      {item && (
        <>
          <figure className="lightbox__figure">
            <img key={item.src} src={item.src} alt={item.alt} />
            <figcaption>
              {item.alt} <span className="lightbox__count">{index + 1} {l.of} {items.length}</span>
            </figcaption>
          </figure>
          <button type="button" className="lightbox__btn lightbox__close" aria-label={l.close} onClick={() => dialog.current.close()}>
            <Icon name="close" />
          </button>
          {items.length > 1 && (
            <>
              <button type="button" className="lightbox__btn lightbox__prev" aria-label={l.prev} onClick={() => go(-1)}>
                <Icon name="arrow" size={28} style={{ transform: 'scaleX(-1)' }} />
              </button>
              <button type="button" className="lightbox__btn lightbox__next" aria-label={l.next} onClick={() => go(1)}>
                <Icon name="arrow" size={28} />
              </button>
            </>
          )}
        </>
      )}
    </dialog>
  )
}
