'use client'

import { metadataText, localized } from '@/lib/website-content'
import { useI18n } from '@/src/i18n'
import { useWebsiteContent } from './WebsiteContentProvider'

export default function Footer() {
  const { language, t } = useI18n()
  const content = useWebsiteContent()
  const footer = content.sections.footer
  const facebook = metadataText(footer, 'facebook', 'https://www.facebook.com/way2pets/')
  const instagram = metadataText(footer, 'instagram', 'https://www.instagram.com/way2petslko/')
  const whatsapp = metadataText(footer, 'whatsapp', '917376126261')

  return (
    <footer>
      <div className="footer-content">
        <h2>Way2<span>Pets</span></h2>
        {localized(footer, 'description', language) && <p>{localized(footer, 'description', language)}</p>}
        <div className="social-icons">
          <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Way2Pets Facebook">
            <i className="fab fa-facebook"></i>
          </a>
          <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Way2Pets Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Way2Pets WhatsApp">
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
        <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>{metadataText(footer, `copyright_${language}`, t.footer.copyright)}</p>
      </div>
    </footer>
  )
}
