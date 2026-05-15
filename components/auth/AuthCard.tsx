'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'

type AuthCardProps = {
  children: ReactNode
  heading: string
  subtitle: string
}

export default function AuthCard({ children, heading, subtitle }: AuthCardProps) {
  return (
    <div className="auth-card">
      <div className="auth-card__brand">
        <Image src="/logo.png" alt="Way2Pets logo" width={112} height={56} priority />
      </div>
      <div className="auth-card__header">
        <h1>{heading}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  )
}
