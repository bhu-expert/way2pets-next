'use client'

import { useState } from 'react'
import { saveCmsResource } from '@/lib/admin-actions'
import type { CmsRow } from '@/lib/cms'

type Section = { heading: string; body: string }

export default function PageEditor({ row }: { row: CmsRow | null }) {
  const content = (row?.content_json && typeof row.content_json === 'object' ? row.content_json : {}) as { sections?: Section[]; faqs?: Section[]; cta?: { heading?: string; body?: string; button_text?: string; button_url?: string } }
  const [sections, setSections] = useState<Section[]>(content.sections?.length ? content.sections : [{ heading: '', body: '' }])
  const [faqs, setFaqs] = useState<Section[]>(content.faqs || [])
  const [cta, setCta] = useState(content.cta || {})
  const contentJson = JSON.stringify({ sections, faqs, cta })

  return (
    <div>
      <div className="admin-page-header"><div><h1>{row?.id ? 'Edit Page' : 'Create Page'}</h1><p>Manage hero, route, status, SEO-ready page sections, FAQs and CTA without editing raw JSON.</p></div></div>
      <form action={saveCmsResource} className="admin-panel admin-form-grid">
        <input type="hidden" name="_resource" value="pages" />
        {row?.id && <input type="hidden" name="id" value={String(row.id)} />}
        <input type="hidden" name="content_json" value={contentJson} />
        <label><span>Page title *</span><input name="title" required defaultValue={String(row?.title || '')} /></label>
        <label><span>Slug *</span><input name="slug" required defaultValue={String(row?.slug || '')} /></label>
        <label><span>Route path *</span><input name="route_path" required defaultValue={String(row?.route_path || '/')} /></label>
        <label><span>Page type</span><input name="page_type" defaultValue={String(row?.page_type || 'landing')} /></label>
        <label><span>Status</span><select name="status" defaultValue={String(row?.status || 'draft')}><option>draft</option><option>published</option><option>scheduled</option><option>archived</option></select></label>
        <label><span>Hero title</span><input name="hero_title" defaultValue={String(row?.hero_title || '')} /></label>
        <label className="admin-field-wide"><span>Hero subtitle</span><textarea name="hero_subtitle" rows={3} defaultValue={String(row?.hero_subtitle || '')} /></label>
        <div className="admin-field-wide"><h2>Content sections</h2>{sections.map((section, index) => <div key={index} className="admin-panel"><input placeholder="Section heading" value={section.heading} onChange={(e) => setSections(sections.map((item, i) => i === index ? { ...item, heading: e.target.value } : item))} /><textarea placeholder="Paste formatted HTML body" rows={6} value={section.body} onChange={(e) => setSections(sections.map((item, i) => i === index ? { ...item, body: e.target.value } : item))} /></div>)}<button type="button" onClick={() => setSections([...sections, { heading: '', body: '' }])}>Add section</button></div>
        <div className="admin-field-wide"><h2>FAQs</h2>{faqs.map((faq, index) => <div key={index} className="admin-panel"><input placeholder="Question" value={faq.heading} onChange={(e) => setFaqs(faqs.map((item, i) => i === index ? { ...item, heading: e.target.value } : item))} /><textarea placeholder="Answer" rows={3} value={faq.body} onChange={(e) => setFaqs(faqs.map((item, i) => i === index ? { ...item, body: e.target.value } : item))} /></div>)}<button type="button" onClick={() => setFaqs([...faqs, { heading: '', body: '' }])}>Add FAQ</button></div>
        <div className="admin-field-wide"><h2>CTA</h2><input placeholder="CTA heading" value={cta.heading || ''} onChange={(e) => setCta({ ...cta, heading: e.target.value })} /><textarea placeholder="CTA body" rows={3} value={cta.body || ''} onChange={(e) => setCta({ ...cta, body: e.target.value })} /><input placeholder="Button text" value={cta.button_text || ''} onChange={(e) => setCta({ ...cta, button_text: e.target.value })} /><input placeholder="Button URL" value={cta.button_url || ''} onChange={(e) => setCta({ ...cta, button_url: e.target.value })} /></div>
        <div className="admin-field-wide admin-form-actions"><button className="admin-button" type="submit">Save page</button></div>
      </form>
    </div>
  )
}
