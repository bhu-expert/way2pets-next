'use client'

import Hero from '@/components/Hero'
import RegisterForm from '@/components/RegisterForm'
import { useI18n } from '@/src/i18n'

export default function RegisterPageContent() {
  const { t } = useI18n()
  return <><Hero title={t.registerPage.heroTitle} subtitle={t.registerPage.heroSubtitle} imageUrl="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" minHeight="50vh" /><section className="contact-section"><div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}><h2 style={{ textAlign: 'center', marginBottom: '30px' }}>{t.registerPage.formTitle}</h2><RegisterForm /></div></section></>
}
