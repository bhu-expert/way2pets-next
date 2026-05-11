'use client'

import { useEffect } from 'react'
import { useI18n } from '@/src/i18n'

export default function LanguageSeo() {
  const { t } = useI18n()

  useEffect(() => {
    document.title = t.seo.title

    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.appendChild(description)
    }
    description.content = t.seo.description
  }, [t])

  return null
}
