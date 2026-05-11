'use client'

import Image from 'next/image'
import ContactForm from '@/components/ContactForm'
import { useI18n } from '@/src/i18n'

type Pet = { name: string; slug: string; pet_type: string; breed?: string; age?: string; gender?: string; price?: number; location?: string; vaccination_status?: string; temperament?: string; health_notes?: string; description?: string; availability_status?: string; image_ids?: string[]; media?: { secure_url?: string; width?: number; height?: number; alt_text?: string } }

export default function PetDetailContent({ pet }: { pet: Pet }) {
  const { t } = useI18n()
  return <section className="contact-section" style={{ paddingTop: '140px' }}><div className="contact-container"><div className="contact-info"><Image src={pet.media?.secure_url || '/logo.png'} alt={pet.media?.alt_text || pet.name || 'Way2Pets pet listing'} width={pet.media?.width || 480} height={pet.media?.height || 320} style={{ maxWidth: '100%', height: 'auto', borderRadius: 16 }} /><h1>{pet.name}</h1><p>{pet.breed} · {pet.age} · {pet.gender}</p><p>{t.common.status}: {pet.availability_status || t.common.available}</p>{pet.price ? <p>{t.common.price}: ₹{pet.price}</p> : null}</div><div className="contact-form-wrapper"><h2>{t.petDetail.about} {pet.name}</h2><p>{pet.description}</p><p><strong>{t.petDetail.vaccination}</strong> {pet.vaccination_status || t.common.askWay2Pets}</p><p><strong>{t.petDetail.temperament}</strong> {pet.temperament || t.common.askWay2Pets}</p><h3>{t.petDetail.enquire}</h3><ContactForm /></div></div></section>
}
