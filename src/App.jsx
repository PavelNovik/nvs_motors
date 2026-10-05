import { useCallback, useEffect, useMemo, useState } from 'react'
import Backdrop from './components/Backdrop.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Why from './components/Why.jsx'
import Gallery from './components/Gallery.jsx'
import CtaBand from './components/CtaBand.jsx'
import Booking from './components/Booking.jsx'
import Faq from './components/Faq.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Lightbox from './components/Lightbox.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import WhatsAppFloat from './components/WhatsAppFloat.jsx'
import { gallery, img } from './config.js'
import { useReveal } from './hooks/useReveal.js'
import { useEffectsFx } from './hooks/useEffectsFx.js'
import { LangProvider, dictionaries, langFromPath, langPath, useLang } from './i18n/index.jsx'
import { applyHead } from './seo.js'

export default function App({ initialLang }) {
  const [lang, setLangState] = useState(initialLang)
  const [viewer, setViewer] = useState(null)
  const [preset, setPreset] = useState(null) // { service, at } — услуга, выбранная в карточке
  useReveal(lang)
  useEffectsFx()

  const setLang = useCallback(
    (next) => {
      if (next === lang) return
      history.pushState(null, '', langPath(next) + location.hash)
      setLangState(next)
    },
    [lang]
  )

  useEffect(() => {
    applyHead(lang)
  }, [lang])

  useEffect(() => {
    const onPop = () => setLangState(langFromPath(location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Кнопка «Zapytaj o termin» в карточке услуги: предзаполнить форму и прокрутить к ней
  const book = useCallback((service = '') => {
    setPreset({ service, at: Date.now() })
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const t = dictionaries[lang]
  const photos = useMemo(() => gallery.map((g) => ({ src: img(`work/${g.id}`), alt: t.gallery.alts[g.id] })), [t])

  return (
    <LangProvider value={{ lang, setLang, book, preset, openGallery: setViewer }}>
      <SkipLink />
      <Backdrop />
      <div className="cursor-glow" aria-hidden="true" />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Services />
        <Why />
        <Gallery />
        <CtaBand />
        <Booking />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
      <CookieConsent />
      <Lightbox items={photos} index={viewer} setIndex={setViewer} />
    </LangProvider>
  )
}

function SkipLink() {
  const { t } = useLang()
  return <a href="#main" className="skip-link">{t.nav.skip}</a>
}
