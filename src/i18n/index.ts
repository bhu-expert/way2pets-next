'use client'

import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import en from './en'
import hi from './hi'

export type Language = 'en' | 'hi'
export const languages: Array<{ code: Language; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
]

type WidenStrings<T> = { readonly [K in keyof T]: T[K] extends string ? string : WidenStrings<T[K]> }
type Dictionary = WidenStrings<typeof en>

const dictionaries: Record<Language, Dictionary> = { en, hi }
const STORAGE_KEY = 'way2pets-language'

type I18nContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: Dictionary
}

const I18nContext = createContext<I18nContextValue | null>(null)

function isLanguage(value: string | null): value is Language {
  return value === 'en' || value === 'hi'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'en'
    }

    const storedLanguage = window.localStorage.getItem(STORAGE_KEY)
    return isLanguage(storedLanguage) ? storedLanguage : 'en'
  })

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    window.localStorage.setItem(STORAGE_KEY, nextLanguage)
  }

  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi-IN' : 'en'
  }, [language])

  const value = useMemo(
    () => ({ language, setLanguage, t: dictionaries[language] }),
    [language],
  )

  return createElement(I18nContext.Provider, { value }, children)
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within LanguageProvider')
  }
  return context
}
