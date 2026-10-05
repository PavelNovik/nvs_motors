import { img } from '../config.js'

// Фиксированный фон с параллаксом (сдвиг — через --scroll в CSS).
// Кадр подбирается под экран: вертикальный для телефонов, широкий — для планшетов и десктопа.
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <picture>
        <source
          media="(max-width: 760px) and (orientation: portrait)"
          srcSet={`${img('bg-mobile', 'sm')} 550w, ${img('bg-mobile')} 1100w`}
          sizes="100vw"
        />
        <img
          className="backdrop__img"
          src={img('bg-desktop', 'sm')}
          srcSet={`${img('bg-desktop', 'sm')} 1200w, ${img('bg-desktop')} 2400w`}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="backdrop__shade" />
      <div className="backdrop__grid" />
    </div>
  )
}
