import { createContext, useContext } from 'react'
import type { Copy } from '../data/copy'
import type { Localized } from '../data/projects'

export type Lang = 'en' | 'id'
export type Currency = 'IDR' | 'USD'

export interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
  currency: Currency
  setCurrency: (currency: Currency) => void
  /** UI copy for the active language */
  t: Copy
  /** Pick the active language from a { en, id } value */
  l: (value: Localized) => string
}

export const LangContext = createContext<LangState | null>(null)

export function useLang() {
  const value = useContext(LangContext)
  if (!value) throw new Error('useLang must be used inside <LangProvider>')
  return value
}
