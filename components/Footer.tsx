'use client'

import { useI18n } from '@/src/i18n'

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer>
      <div className="footer-content">
        <h2>Way2<span>Pets</span></h2>
        <div className="social-icons">
          <a href="https://www.facebook.com/way2pets/" target="_blank" rel="noopener noreferrer" aria-label="Way2Pets Facebook">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.instagram.com/way2petslko/" target="_blank" rel="noopener noreferrer" aria-label="Way2Pets Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://wa.me/917376126261" target="_blank" rel="noopener noreferrer" aria-label="Way2Pets WhatsApp">
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
        <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>{t.footer.copyright}</p>
      </div>
    </footer>
  )
}
