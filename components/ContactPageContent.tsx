'use client'

import Hero from '@/components/Hero'
import ContactForm from '@/components/ContactForm'
import { useI18n } from '@/src/i18n'

export default function ContactPageContent() {
  const { t } = useI18n()
  return (
    <>
      <Hero title={t.contactPage.heroTitle} subtitle={t.contactPage.heroSubtitle} imageUrl="https://images.unsplash.com/photo-1596272875729-ed2c18bb7f6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" minHeight="40vh" />
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <div>
              <h3>{t.sections.visitUs}</h3><p>{t.contactPage.visitText}</p>
              <div className="info-item"><i className="fas fa-map-marker-alt"></i><span>1/673, Vishal Khand 1, Vishal Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010, India</span></div>
              <div className="info-item"><i className="fas fa-phone-alt"></i><span>+91 73761 26261</span></div>
              <div className="info-item"><i className="fas fa-envelope"></i><span>care@way2pets.com</span></div>
              <div className="info-item"><i className="fas fa-clock"></i><span>{t.contactPage.hours}</span></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', height: '200px', borderRadius: '10px', overflow: 'hidden' }}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.6646399432646!2d80.9965!3d26.8505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDUxJzAxLjgiTiA4MMKwNTknNDcuNCJF!5e0!3m2!1sen!2sin!4v1620000000000" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title={t.common.way2petsLocation} />
            </div>
          </div>
          <div className="contact-form-wrapper"><h3>{t.sections.sendMessage}</h3><ContactForm /></div>
        </div>
      </section>
    </>
  )
}
