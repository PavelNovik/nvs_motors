import { brand, img, services } from './config.js'
import { dictionaries, languages, defaultLang, langPath } from './i18n/index.jsx'

const abs = (path) => brand.siteUrl.replace(/\/$/, '') + path

// Schema.org: автосервис (AutoRepair + TireShop) с адресом, часами, рейтингом Google, услугами и FAQ —
// для Google, карт и ИИ-ассистентов
export function jsonLd(lang) {
  const t = dictionaries[lang]
  const url = abs(langPath(lang))
  const bizId = abs('/#business')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['AutoRepair', 'TireShop'],
        '@id': bizId,
        name: brand.name,
        alternateName: brand.fullName,
        slogan: 'Twój samochód — nasza pasja!',
        description: t.meta.description,
        url: abs('/'),
        logo: abs('/logo.png'),
        image: [abs('/og-image.jpg'), abs(img('work/lift')), abs(img('work/g-class'))],
        telephone: brand.phone,
        founder: { '@type': 'Person', name: brand.owner },
        priceRange: '$$',
        currenciesAccepted: 'PLN',
        areaServed: [{ '@type': 'City', name: brand.city }, { '@type': 'AdministrativeArea', name: 'Wielkopolska' }],
        knowsLanguage: ['pl', 'uk'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: brand.street,
          postalCode: brand.postalCode,
          addressLocality: brand.city,
          addressRegion: 'wielkopolskie',
          addressCountry: brand.country,
        },
        geo: { '@type': 'GeoCoordinates', latitude: brand.geo.lat, longitude: brand.geo.lng },
        hasMap: brand.maps,
        openingHoursSpecification: brand.hours.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
        aggregateRating: { '@type': 'AggregateRating', ratingValue: brand.rating.value, reviewCount: brand.rating.count, bestRating: 5 },
        sameAs: [...Object.values(brand.social), brand.maps],
        potentialAction: {
          '@type': 'ReserveAction',
          target: { '@type': 'EntryPoint', urlTemplate: `https://wa.me/${brand.whatsapp}`, actionPlatform: 'https://schema.org/MobileWebPlatform' },
          name: t.booking.title,
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: t.services.title,
          itemListElement: services.map((id) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: t.services.items[id].name,
              description: t.services.items[id].text,
              serviceType: t.services.items[id].points.join(', '),
              provider: { '@id': bizId },
              areaServed: { '@type': 'City', name: brand.city },
            },
          })),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': url + '#faq',
        inLanguage: lang,
        mainEntity: t.faq.items.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'WebPage',
        '@id': url + '#webpage',
        url,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: lang,
        about: { '@id': bizId },
        primaryImageOfPage: abs('/og-image.jpg'),
        isPartOf: { '@type': 'WebSite', name: brand.name, url: abs('/') },
      },
    ],
  }
}

function headTags(lang) {
  const t = dictionaries[lang]
  const { title, description } = t.meta
  const url = abs(langPath(lang))
  const image = abs('/og-image.jpg')
  return [
    ['meta', { name: 'description', content: description }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' }],
    ['meta', { name: 'geo.region', content: 'PL-30' }],
    ['meta', { name: 'geo.placename', content: brand.city }],
    ['meta', { name: 'geo.position', content: `${brand.geo.lat};${brand.geo.lng}` }],
    ['meta', { name: 'ICBM', content: `${brand.geo.lat}, ${brand.geo.lng}` }],
    ['link', { rel: 'canonical', href: url }],
    ...languages.map((l) => ['link', { rel: 'alternate', hreflang: l, href: abs(langPath(l)) }]),
    ['link', { rel: 'alternate', hreflang: 'x-default', href: abs(langPath(defaultLang)) }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: brand.name }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:locale', content: t.locale }],
    ...languages
      .filter((l) => l !== lang)
      .map((l) => ['meta', { property: 'og:locale:alternate', content: dictionaries[l].locale }]),
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: image }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd(lang)).replace(/</g, '\\u003c')],
  ]
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function renderHead(lang) {
  const tags = headTags(lang).map(([tag, attrs, text]) => {
    const a = Object.entries(attrs).map(([k, v]) => ` ${k}="${esc(v)}"`).join('')
    return tag === 'script' ? `<script data-seo${a}>${text}</script>` : `<${tag} data-seo${a}>`
  })
  return [`<title>${esc(dictionaries[lang].meta.title)}</title>`, ...tags].join('\n    ')
}

export function applyHead(lang) {
  document.documentElement.lang = lang
  document.title = dictionaries[lang].meta.title
  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove())
  const frag = document.createDocumentFragment()
  headTags(lang).forEach(([tag, attrs, text]) => {
    const el = document.createElement(tag)
    el.setAttribute('data-seo', '')
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
    if (text) el.textContent = text
    frag.appendChild(el)
  })
  document.head.appendChild(frag)
}

export function robotsTxt() {
  const aiBots = [
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
    'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot',
    'CCBot', 'meta-externalagent', 'DuckAssistBot',
  ]
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI search & assistants are welcome',
    ...aiBots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    `Sitemap: ${abs('/sitemap.xml')}`,
    '',
  ].join('\n')
}

export function sitemapXml() {
  const today = new Date().toISOString().slice(0, 10)
  const alternates = [
    ...languages.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(langPath(l))}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(langPath(defaultLang))}"/>`,
  ].join('\n')
  const urls = languages.map(
    (l) => `  <url>
    <loc>${abs(langPath(l))}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${l === defaultLang ? '1.0' : '0.9'}</priority>
${alternates}
  </url>`
  )
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`
}

// llms.txt — краткое описание фирмы в Markdown для языковых моделей (llmstxt.org)
export function llmsTxt() {
  const pl = dictionaries.pl
  const uk = dictionaries.uk
  return [
    `# ${brand.fullName}`,
    '',
    `> ${pl.meta.description}`,
    '',
    `NVS Motors is a newly opened independent car repair shop (warsztat samochodowy) in ${brand.city}, Poland, run by ${brand.owner}. It repairs passenger cars and vans of all makes. Service in Polish and Ukrainian. Appointments via WhatsApp or phone, free slots available right away. Google rating ${brand.rating.value}/5 (${brand.rating.count} reviews).`,
    '',
    '## Pages',
    '',
    ...languages.map((l) => `- [${dictionaries[l].name}](${abs(langPath(l))}): ${dictionaries[l].meta.title}`),
    '',
    '## Services',
    '',
    ...services.map((id) => {
      const s = pl.services.items[id]
      return `- ${s.name} (${uk.services.items[id].name}): ${s.text} [${s.points.join(', ')}]`
    }),
    '',
    '## Why NVS Motors',
    '',
    ...pl.why.items.map((w) => `- ${w.title}: ${w.text}`),
    '',
    '## FAQ',
    '',
    ...pl.faq.items.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
    '## Contact',
    '',
    `- Address: ${brand.street}, ${brand.postalCode} ${brand.city}, Poland (geo ${brand.geo.lat}, ${brand.geo.lng})`,
    ...pl.contact.hours.map(([d, h]) => `- ${d}: ${h}`),
    `- Phone / WhatsApp: ${brand.phone} (https://wa.me/${brand.whatsapp})`,
    `- Google Maps: ${brand.maps}`,
    `- Instagram: ${brand.social.instagram}`,
    `- TikTok: ${brand.social.tiktok}`,
    '',
  ].join('\n')
}
