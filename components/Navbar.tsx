'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/boarding', label: 'Boarding' },
  { href: '/find-a-pet', label: 'Find a Pet' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/blog', label: 'Blog' },
  { href: '/register', label: 'Register Pet' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header>
      <nav>
        <div className="logo">
          <Link href="/">
            <Image src="/logo.png" alt="Way2Pets Logo" width={120} height={60} style={{ height: '60px', width: 'auto' }} priority />
          </Link>
        </div>
        <div className="nav-links">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? 'active' : ''}
            >
              {label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary">
            Contact Us
          </Link>
        </div>
      </nav>
    </header>
  )
}
