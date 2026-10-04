import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { copy } from '../data/copy'
import { site } from '../data/site'
import { LangContext, type Currency, type Lang } from './context'

const STORAGE_KEY = 'pixelan:prefs'

function readPrefs(): { lang?: Lang; currency?: Currency } {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writePrefs(prefs: { lang: Lang; currency: Currency | null }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    /* storage unavailable — preferences just won't persist */
  }
}

/** `?lang=id` / `?lang=en` in the URL wins (used by search engines via hreflang). */
function urlLang(): Lang | null {
  const value = new URLSearchParams(window.location.search).get('lang')
  return value === 'id' || value === 'en' ? value : null
}

function setMeta(selector: string, attr: string, value: string) {
  document.querySelector(selector)?.setAttribute(attr, value)
}

export default function LangProvider({ children }: { children: ReactNode }) {
  // Server render (and the first client render) is always English so hydration matches;
  // the visitor's saved / URL language is applied right after, while the preloader is still up.
  const [lang, setLangState] = useState<Lang>('en')
  // null = follow the language (EN → Dollar, ID → Rupiah) until the visitor picks one
  const [manualCurrency, setManualCurrency] = useState<Currency | null>(null)
  const [restored, setRestored] = useState(false)
  const currency: Currency = manualCurrency ?? (lang === 'id' ? 'IDR' : 'USD')

  useEffect(() => {
    const prefs = readPrefs()
    setLangState(urlLang() ?? prefs.lang ?? 'en')
    setManualCurrency(prefs.currency ?? null)
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writePrefs({ lang, currency: manualCurrency })
  }, [lang, manualCurrency, restored])

  // Keep <html lang>, title, description and canonical in sync with the language
  useEffect(() => {
    const seo = copy[lang].seo
    document.documentElement.lang = lang
    document.title = seo.title
    setMeta('meta[name="description"]', 'content', seo.description)
    setMeta('meta[property="og:title"]', 'content', seo.title)
    setMeta('meta[property="og:description"]', 'content', seo.description)
    setMeta('meta[property="og:locale"]', 'content', lang === 'id' ? 'id_ID' : 'en_US')
    setMeta('meta[name="twitter:title"]', 'content', seo.title)
    setMeta('meta[name="twitter:description"]', 'content', seo.description)

    // Only rewrite the URL if it already carries a language (don't add params to clean links)
    if (urlLang()) {
      const url = new URL(window.location.href)
      url.searchParams.set('lang', lang)
      window.history.replaceState(null, '', url)
      setMeta('link[rel="canonical"]', 'href', `${site.url}?lang=${lang}`)
    }
  }, [lang])

  const setLang = useCallback((next: Lang) => setLangState(next), [])
  const setCurrency = useCallback((next: Currency) => setManualCurrency(next), [])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      currency,
      setCurrency,
      t: copy[lang],
      l: (v: { en: string; id: string }) => v[lang],
    }),
    [lang, currency, setLang, setCurrency]
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
