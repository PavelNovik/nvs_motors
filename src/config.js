// Данные NVS Motors (флаер, описание фирмы, Google Maps — октябрь 2026). Тексты — в src/i18n/*.js
// __SITE_URL__ подставляет Vite; при запуске из node (scripts/fetch-images.js) его нет.
const envSiteUrl = typeof __SITE_URL__ !== 'undefined' ? __SITE_URL__ : ''

export const brand = {
  name: 'NVS Motors',
  fullName: 'NVS MOTORS — Warsztat Samochodowy Poznań',
  owner: 'Vadym',
  // TODO: заменить на свой домен, когда он появится (или задать SITE_URL при сборке)
  siteUrl: envSiteUrl || 'https://nvsmotors.pl',
  phone: '+48 453 182 276',
  whatsapp: '48453182276',
  street: 'ul. Główna 10',
  postalCode: '61-005',
  city: 'Poznań',
  country: 'PL',
  geo: { lat: 52.4181773, lng: 16.9638822 },
  maps: 'https://maps.app.goo.gl/eAxkdq19BceYYos56',
  mapsReviews: 'https://www.google.com/maps/place/?q=place_id&ftid=0x47045b4854d32b0b:0xc4c3dea50cf7a570',
  // Часы работы: ключи 1–6 = пн–сб (Date.getDay), воскресенье закрыто
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], dayNums: [1, 2, 3, 4, 5], opens: '08:00', closes: '18:00' },
    { days: ['Saturday'], dayNums: [6], opens: '09:00', closes: '13:00' },
  ],
  // Рейтинг из Google Maps (5,0 — 43 opinie, 05.10.2026)
  rating: { value: 5, count: 43 },
  social: {
    instagram: 'https://www.instagram.com/nvsmotorss/',
    tiktok: 'https://www.tiktok.com/@nvs_motors_auto_naprawa',
  },
}

export const tel = `tel:${brand.phone.replace(/\s/g, '')}`
export const waLink = (text = '') => `https://wa.me/${brand.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`
export const mapEmbed = `https://www.google.com/maps?q=${brand.geo.lat},${brand.geo.lng}&z=16&hl=pl&output=embed`

export const img = (name, size) => `/images/${name}${size === 'sm' ? '-sm' : ''}.webp`

// Услуги (порядок карточек); тексты — t.services.items[id]
export const services = ['tires', 'ac', 'oil', 'suspension', 'brakes', 'diagnostics', 'mechanics', 'maintenance']

// Фото работ — кадры из Instagram @nvsmotorss (raw/ig/<file>.jpg); подписи — t.gallery.alts[id]
export const gallery = [
  { id: 'lift', file: 'ig4' },
  { id: 'ac-station', file: 'ig10' },
  { id: 'g-class', file: 'ig11' },
  { id: 'workshop', file: 'ig3' },
  { id: 'lift-2', file: 'ig5' },
  { id: 'ramps', file: 'ig6' },
  { id: 'wheels', file: 'ig8', position: 'left' },
  { id: 'hall', file: 'ig2' },
]

// Разделы в меню (якоря)
export const navIds = ['services', 'why', 'gallery', 'booking', 'contact']

// Открыто ли сейчас (время Варшавы) — для бейджа в шапке/hero
export function openNow(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Warsaw', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  )
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday)
  const mins = Number(parts.hour) * 60 + Number(parts.minute)
  const toMin = (s) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3))
  const slot = brand.hours.find((h) => h.dayNums.includes(day))
  if (!slot) return { open: false }
  return { open: mins >= toMin(slot.opens) && mins < toMin(slot.closes), closes: slot.closes }
}
