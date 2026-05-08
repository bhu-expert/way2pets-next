'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/pet-boarding-for-cat-and-dog-in-lucknow', label: 'Boarding' },
  { href: '/find-a-pet', label: 'Find a Pet' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/blog', label: 'Blog' },
  { href: '/register', label: 'Register Pet' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header>
      <nav>
        <div className="logo">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image src="/logo.png" alt="Way2Pets Logo" width={120} height={60} style={{ height: '60px', width: 'auto' }} priority />
          </Link>
        </div>
        <button className="mobile-menu-button" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((value) => !value)}>
          <span className="sr-only">Toggle navigation</span>
          <i className="fas fa-bars" aria-hidden="true"></i>
        </button>
        <div id="primary-navigation" className={`nav-links ${open ? 'open' : ''}`}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
            Contact Us
          </Link>
        </div>
      </nav>
    </header>
  )
}
