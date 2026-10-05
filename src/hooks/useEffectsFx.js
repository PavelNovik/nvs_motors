import { useEffect } from 'react'

// Визуальные эффекты страницы (только в браузере, без влияния на пререндер):
// 1) параллакс фиксированного фона — CSS-переменная --scroll на <html> (rAF, без background-attachment:fixed, который ломается на iOS);
// 2) подсветка курсора — --mx/--my на <html> для общего свечения и --x/--y на карточке [data-glow] под курсором.
export function useEffectsFx() {
  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (!reduced) root.style.setProperty('--scroll', String(window.scrollY))
        root.classList.toggle('is-scrolled', window.scrollY > 24)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Курсор — только для мыши/тачпада
    const fine = window.matchMedia('(pointer: fine)').matches
    let moveRaf = 0
    let last = null
    const onMove = (e) => {
      last = e
      if (moveRaf) return
      moveRaf = requestAnimationFrame(() => {
        moveRaf = 0
        root.style.setProperty('--mx', `${last.clientX}px`)
        root.style.setProperty('--my', `${last.clientY}px`)
        root.classList.add('has-cursor')
        const card = last.target instanceof Element ? last.target.closest('[data-glow]') : null
        if (card) {
          const r = card.getBoundingClientRect()
          card.style.setProperty('--x', `${last.clientX - r.left}px`)
          card.style.setProperty('--y', `${last.clientY - r.top}px`)
        }
      })
    }
    const onLeave = () => root.classList.remove('has-cursor')
    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(moveRaf)
    }
  }, [])
}
