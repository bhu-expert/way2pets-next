'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { languages, useI18n } from '@/src/i18n'

const navLinks = [
  { href: '/', labelKey: 'home' },
  { href: '/pet-boarding-for-cat-and-dog-in-lucknow', labelKey: 'boarding' },
  { href: '/find-a-pet', labelKey: 'findPet' },
  { href: '/gallery', labelKey: 'gallery' },
  { href: '/reviews', labelKey: 'reviews' },
  { href: '/blog', labelKey: 'blog' },
  { href: '/register', labelKey: 'registerPet' },
] as const

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { language, setLanguage, t } = useI18n()

  return (
    <header>
      <nav>
        <div className="logo">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image src="/logo.png" alt="Way2Pets Logo" width={120} height={60} style={{ height: '60px', width: 'auto' }} priority />
          </Link>
        </div>
        <button className="mobile-menu-button" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((value) => !value)}>
          <span className="sr-only">{t.nav.toggleNavigation}</span>
          <i className="fas fa-bars" aria-hidden="true"></i>
        </button>
        <div id="primary-navigation" className={`nav-links ${open ? 'open' : ''}`}>
          {navLinks.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {t.nav[labelKey]}
            </Link>
          ))}
          <div className="language-switcher" role="group" aria-label={t.nav.languageLabel}>
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                className={language === item.code ? 'active' : ''}
                aria-pressed={language === item.code}
                onClick={() => setLanguage(item.code)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Link href="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
            {t.nav.contactUs}
          </Link>
        </div>
      </nav>
    </header>
  )
}
