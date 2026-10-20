import { useEffect, useState } from 'react'
import { brand } from '../config.js'

const { lat, lng } = brand.geo
const googleRoute = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

// Ссылка «маршрут до NVS Motors» под устройство:
// - iPhone/iPad — Apple Maps сразу с маршрутом (daddr);
// - Android — geo: URI, система предлагает выбрать приложение карт (Google Maps, Waze…);
// - компьютер — Google Maps с маршрутом в новой вкладке.
// В пререндере и до гидратации — ссылка Google (её же видят поисковики).
function routeFor(ua, touchMac) {
  if (/iPad|iPhone|iPod/.test(ua) || touchMac) {
    return { href: `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`, blank: false }
  }
  if (/Android/i.test(ua)) {
    return { href: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(brand.name)})`, blank: false }
  }
  return { href: googleRoute, blank: true }
}

export default function RouteLink({ children, ...rest }) {
  const [route, setRoute] = useState({ href: googleRoute, blank: true })

  useEffect(() => {
    const touchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
    setRoute(routeFor(navigator.userAgent, touchMac))
  }, [])

  return (
    <a href={route.href} {...(route.blank ? { target: '_blank', rel: 'noopener' } : {})} {...rest}>
      {children}
    </a>
  )
}
